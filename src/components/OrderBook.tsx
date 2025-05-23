
'use client';

import type { CoinGeckoToken, OrderBookData, OrderBookEntry } from '@/lib/types';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Wifi, WifiOff } from 'lucide-react';

interface OrderBookProps {
  token: CoinGeckoToken | null;
  onPriceUpdate: (price: number | null) => void; // Callback to update parent's price
  currentPrice: number | null; // Received from parent, used for display fallback
}

const MAX_LEVELS = 10; // Display top N levels

export default function OrderBook({ token, onPriceUpdate, currentPrice }: OrderBookProps) {
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setBids([]);
      setAsks([]);
      setIsConnected(false);
      setError(null);
      onPriceUpdate(null);
      return;
    }

    const pair = `${token.symbol.toLowerCase()}usdt`;
    const wsUrl = `wss://stream.binance.com:9443/ws/${pair}@depth`;

    setIsLoading(true);
    setError(null);
    setBids([]);
    setAsks([]);

    if (wsRef.current) {
      wsRef.current.close();
    }

    const newWs = new WebSocket(wsUrl);
    wsRef.current = newWs;

    newWs.onopen = () => {
      console.log(`Connected to Binance WebSocket for ${pair}`);
      setIsConnected(true);
      setIsLoading(false);
      setError(null);
    };

    newWs.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string);
        // The @depth stream directly gives the full order book levels
        if (data.bids && data.asks) {
          const formattedBids: OrderBookEntry[] = data.bids
            .slice(0, MAX_LEVELS)
            .map((b: [string, string]) => ({ price: parseFloat(b[0]), quantity: parseFloat(b[1]) }));
          const formattedAsks: OrderBookEntry[] = data.asks
            .slice(0, MAX_LEVELS)
            .map((a: [string, string]) => ({ price: parseFloat(a[0]), quantity: parseFloat(a[1]) }));
          
          setBids(formattedBids);
          setAsks(formattedAsks);

          if (formattedBids.length > 0 && formattedAsks.length > 0) {
            const bestBid = formattedBids[0].price;
            const bestAsk = formattedAsks[0].price;
            if (bestBid && bestAsk) {
                onPriceUpdate((bestBid + bestAsk) / 2);
            }
          }
        } else if (data.e === 'depthUpdate') {
            // For handling @depthUpdate streams if chosen (more complex state management)
            // For now, we primarily rely on the full @depth stream's periodic updates.
            // console.log('Depth update received (not fully processed for this demo):', data);
        }
      } catch (e) {
        console.error('Error processing WebSocket message:', e);
        setError('Error processing order book data.');
      }
    };

    newWs.onerror = (event) => {
      console.error(`WebSocket error for ${pair}:`, event);
      setError(`Failed to connect to ${pair} order book. Token might not be listed on Binance or network issue.`);
      setIsLoading(false);
      setIsConnected(false);
      onPriceUpdate(null);
    };

    newWs.onclose = () => {
      console.log(`Disconnected from Binance WebSocket for ${pair}`);
      setIsConnected(false);
      // Don't clear error here, it might be an error-driven close
    };

    return () => {
      if (newWs) {
        newWs.close();
      }
      wsRef.current = null;
    };
  }, [token, onPriceUpdate]);

  const renderOrderBookTable = (entries: OrderBookEntry[], type: 'Bids' | 'Asks') => (
    <div className="flex-1">
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="border-b-0">
            <TableHead className="w-1/2 py-1 px-2 text-left">Price (USD)</TableHead>
            <TableHead className="w-1/2 py-1 px-2 text-right">Size ({token?.symbol.toUpperCase()})</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(isLoading && entries.length === 0) && Array.from({ length: MAX_LEVELS / 2 }).map((_, i) => (
            <TableRow key={`skeleton-${type}-${i}`} className="border-b-0">
              <TableCell className="py-0.5 px-2"><Skeleton className="h-3 w-full" /></TableCell>
              <TableCell className="py-0.5 px-2 text-right"><Skeleton className="h-3 w-full" /></TableCell>
            </TableRow>
          ))}
          {entries.map((entry, index) => (
            <TableRow key={`${type}-${index}-${entry.price}`} className="border-b-0 hover:bg-muted/30 relative">
              <TableCell className={`py-0.5 px-2 ${type === 'Bids' ? 'text-green-500' : 'text-red-500'}`}>
                {entry.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: Math.max(2, (entry.price.toString().split('.')[1] || '').length) })}
              </TableCell>
              <TableCell className="py-0.5 px-2 text-right text-foreground">{entry.quantity.toFixed(4)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const topAskPrice = asks.length > 0 ? asks[0].price : null;
  const topBidPrice = bids.length > 0 ? bids[0].price : null;
  const displayPrice = currentPrice ?? (topAskPrice && topBidPrice ? (topAskPrice + topBidPrice) / 2 : null);


  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Order Book</CardTitle>
        {token && (isConnected ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />)}
      </CardHeader>
      <CardContent className="flex-grow p-0 flex flex-col overflow-hidden">
        {!token ? (
          <div className="flex-grow flex items-center justify-center p-4">
            <p className="text-xs text-muted-foreground">Select a token to see the order book.</p>
          </div>
        ) : error ? (
          <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <p className="text-sm text-destructive font-medium">Connection Error</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        ) : (
          <>
            {renderOrderBookTable(asks.slice().sort((a,b) => a.price - b.price), 'Asks')}
             <div className="py-1.5 px-4 border-t border-b border-border my-1 text-center">
                <span className={`text-lg font-semibold ${ (displayPrice ?? 0) > (currentPrice ?? (displayPrice ?? 0)-0.01) ? 'text-green-500' : (displayPrice ?? 0) < (currentPrice ?? (displayPrice ?? 0)+0.01) ? 'text-red-500' : 'text-foreground'}`}>
                    {displayPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: Math.max(2, (displayPrice?.toString().split('.')[1] || '').length )}) ?? (isLoading ? 'Loading...' : '-.--')}
                </span>
            </div>
            {renderOrderBookTable(bids, 'Bids')}
          </>
        )}
        {(isLoading && !error && token) && (
            <div className="absolute inset-0 bg-card/50 flex items-center justify-center">
                <p className="text-sm text-muted-foreground">Connecting to order book...</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
