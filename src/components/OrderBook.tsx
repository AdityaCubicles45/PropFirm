
'use client';

import type { CoinGeckoToken, OrderBookData, OrderBookEntry } from '@/lib/types';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Wifi, WifiOff, PackageOpen } from 'lucide-react';

interface OrderBookProps {
  token: CoinGeckoToken | null;
  onPriceUpdate: (price: number | null) => void; 
  currentPrice: number | null; // Received from parent, used for display fallback
}

const MAX_LEVELS = 10; 

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
      setIsLoading(false);
      setError(null);
      onPriceUpdate(null);
      return;
    }

    const pair = `${token.symbol.toLowerCase()}usdt`;
    const wsUrl = `wss://stream.binance.com:9443/ws/${pair}@depth`;

    setBids([]);
    setAsks([]);
    setIsLoading(true);
    setError(null);
    setIsConnected(false); // Reset connection status

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
        if (data.bids && data.asks) {
          const formattedBids: OrderBookEntry[] = data.bids
            .slice(0, MAX_LEVELS)
            .map((b: [string, string]) => ({ price: parseFloat(b[0]), quantity: parseFloat(b[1]) }));
          const formattedAsks: OrderBookEntry[] = data.asks
            .slice(0, MAX_LEVELS)
            .map((a: [string, string]) => ({ price: parseFloat(a[0]), quantity: parseFloat(a[1]) }));
          
          setBids(formattedBids);
          setAsks(formattedAsks.sort((a, b) => a.price - b.price)); // Ensure asks are sorted ascending for display

          if (formattedBids.length > 0 && formattedAsks.length > 0) {
            const bestBid = formattedBids[0].price; // Bids are sorted descending, so first is highest
            const bestAsk = formattedAsks[0].price; // Asks are sorted ascending, so first is lowest
            if (bestBid && bestAsk) {
                onPriceUpdate((bestBid + bestAsk) / 2);
            }
          } else {
            onPriceUpdate(null); // No valid bid/ask spread
          }
        }
      } catch (e) {
        console.error('Error processing WebSocket message:', e);
        setError('Error processing order book data.');
        setIsLoading(false); // Stop loading on parse error
      }
    };

    newWs.onerror = (event) => {
      console.error(`WebSocket error for ${pair}:`, event);
      setError(`Connection failed. Token pair '${token.symbol.toUpperCase()}/USDT' may not be available on Binance or network issue.`);
      setIsLoading(false);
      setIsConnected(false);
      onPriceUpdate(null);
    };

    newWs.onclose = () => {
      console.log(`Disconnected from Binance WebSocket for ${pair}`);
      setIsConnected(false);
      setIsLoading(false); // Ensure loading is stopped
      // Don't clear error, it might be an error-driven close or a clean close after an error.
      // If it was a clean close without prior error, the user might just see "No data received".
    };

    return () => {
      if (newWs) {
        newWs.close();
      }
      wsRef.current = null;
    };
  }, [token, onPriceUpdate]);

  const renderOrderBookTable = (entries: OrderBookEntry[], type: 'Bids' | 'Asks') => (
    <div className="flex-1 overflow-y-auto">
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="border-b-0 sticky top-0 bg-card z-10">
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
  
  const topAskPrice = asks.length > 0 ? asks[0].price : null; // Asks are sorted ascending
  const topBidPrice = bids.length > 0 ? bids[0].price : null; // Bids are sorted descending
  
  let calculatedMidPrice: number | null = null;
  if (topAskPrice !== null && topBidPrice !== null) {
    calculatedMidPrice = (topAskPrice + topBidPrice) / 2;
  }

  // Prioritize calculated mid-price from WS, fallback to parent's currentPrice if WS data isn't complete.
  const displayPrice = calculatedMidPrice ?? currentPrice;


  const NoDataMessage = () => (
    <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
        <PackageOpen className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground font-medium">No Order Book Data</p>
        <p className="text-xs text-muted-foreground">
            {token ? `Waiting for data for ${token.symbol.toUpperCase()}/USDT or pair not actively traded.` : 'Select a token.'}
        </p>
    </div>
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between border-b">
        <CardTitle className="text-sm font-medium">Order Book</CardTitle>
        {token && (isConnected ? <Wifi className="h-4 w-4 text-green-500" title="Connected" /> : <WifiOff className="h-4 w-4 text-red-500" title="Disconnected"/>)}
      </CardHeader>
      <CardContent className="flex-grow p-0 flex flex-col overflow-hidden">
        {!token ? (
          <div className="flex-grow flex items-center justify-center p-4">
            <p className="text-xs text-muted-foreground">Select a token to see the order book.</p>
          </div>
        ) : isLoading ? (
             <div className="flex-grow flex flex-col items-center justify-center p-4">
                <Skeleton className="h-4 w-20 mb-2" />
                 {Array.from({ length: MAX_LEVELS / 2 * 2 + 1 }).map((_, i) => (
                    <div key={`load-skel-${i}`} className="flex w-full px-2 py-0.5">
                        <Skeleton className="h-3 w-1/2 mr-1" />
                        <Skeleton className="h-3 w-1/2 ml-1" />
                    </div>
                ))}
                <p className="text-sm text-muted-foreground mt-2">Connecting to order book...</p>
            </div>
        ) : error ? (
          <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
            <AlertTriangle className="h-8 w-8 text-destructive mb-2" />
            <p className="text-sm text-destructive font-medium">Connection Error</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        ) : (bids.length === 0 && asks.length === 0 && !isLoading) ? (
            <NoDataMessage />
        ) : (
          <>
            {renderOrderBookTable(asks, 'Asks')} {/* Asks are already sorted ascending */}
             <div className="py-1.5 px-4 border-t border-b border-border my-1 text-center">
                <span className={`text-lg font-semibold ${ (displayPrice ?? 0) > (currentPrice ?? (displayPrice ?? 0)-0.01) ? 'text-green-500' : (displayPrice ?? 0) < (currentPrice ?? (displayPrice ?? 0)+0.01) ? 'text-red-500' : 'text-foreground'}`}>
                    {displayPrice !== null ? displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: Math.max(2, (displayPrice.toString().split('.')[1] || '').length )}) : '-.--'}
                </span>
            </div>
            {renderOrderBookTable(bids, 'Bids')} {/* Bids are already sorted descending */}
          </>
        )}
      </CardContent>
    </Card>
  );
}
