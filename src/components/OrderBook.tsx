'use client';

import type { CoinGeckoToken, OrderBookData, OrderBookEntry } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpDown } from 'lucide-react';

interface OrderBookProps {
  token: CoinGeckoToken | null;
  currentPrice: number | null; // For central price display
}

const generateMockOrderBookData = (basePrice: number): OrderBookData => {
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];
  const numEntries = 10;

  for (let i = 0; i < numEntries; i++) {
    bids.push({
      price: basePrice - (i + 1) * (basePrice * 0.0005 + Math.random() * 0.01 * (i+1)), // Bids slightly lower
      quantity: Math.random() * 5 + 0.1,
    });
    asks.push({
      price: basePrice + (i + 1) * (basePrice * 0.0005 + Math.random() * 0.01 * (i+1)), // Asks slightly higher
      quantity: Math.random() * 5 + 0.1,
    });
  }
  bids.sort((a, b) => b.price - a.price);
  asks.sort((a, b) => a.price - b.price).reverse(); // Asks should be ascending from center
  return { bids, asks };
};


export default function OrderBook({ token, currentPrice }: OrderBookProps) {
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && currentPrice) {
      setLoading(true);
      setOrderBook(generateMockOrderBookData(currentPrice));
      setLoading(false);

      const intervalId = setInterval(() => {
        setOrderBook(prevOrderBook => {
          if (prevOrderBook && currentPrice) {
            return generateMockOrderBookData(currentPrice + (Math.random() - 0.5) * currentPrice * 0.0001);
          }
          return prevOrderBook;
        });
      }, 3000);

      return () => clearInterval(intervalId);
    } else {
      setOrderBook(null);
    }
  }, [token, currentPrice]);
  
  const renderOrderBookTable = (entries: OrderBookEntry[], type: 'Bids' | 'Asks') => (
    <div className="flex-1">
      <Table className="text-xs">
        <TableHeader>
          <TableRow className="border-b-0">
            <TableHead className={`w-[33%] py-1 px-2 ${type === 'Bids' ? 'text-left' : 'text-left'}`}>Price (USD)</TableHead>
            <TableHead className="w-[33%] py-1 px-2 text-right">Size</TableHead>
            <TableHead className="w-[33%] py-1 px-2 text-right">Mine</TableHead> {/* Mocked "Mine" */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={`skeleton-${type}-${i}`} className="border-b-0">
              <TableCell className="py-0.5 px-2"><Skeleton className="h-3 w-full" /></TableCell>
              <TableCell className="py-0.5 px-2 text-right"><Skeleton className="h-3 w-full" /></TableCell>
              <TableCell className="py-0.5 px-2 text-right"><Skeleton className="h-3 w-full" /></TableCell>
            </TableRow>
          ))}
          {!loading && entries.map((entry, index) => (
            <TableRow key={`${type}-${index}-${entry.price}`} className="border-b-0 hover:bg-muted/30">
              <TableCell className={`py-0.5 px-2 ${type === 'Bids' ? 'text-green-500' : 'text-red-500'}`}>
                {entry.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </TableCell>
              <TableCell className="py-0.5 px-2 text-right text-foreground">{entry.quantity.toFixed(4)}</TableCell>
              <TableCell className="py-0.5 px-2 text-right text-muted-foreground">{(entry.price * entry.quantity / 1000).toFixed(2)}K</TableCell> 
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-sm font-medium">Order Book</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 flex flex-col overflow-hidden">
        { !token ? (
          <div className="flex-grow flex items-center justify-center p-4">
            <p className="text-xs text-muted-foreground">Select a token to see the order book.</p>
          </div>
        ) : !orderBook && !loading ? (
          <div className="flex-grow flex items-center justify-center p-4">
           <p className="text-xs text-muted-foreground">No order book data available.</p>
          </div>
        ) : (
          <>
            {orderBook?.asks && renderOrderBookTable(orderBook.asks.slice().reverse(), 'Asks')}
            <div className="py-1.5 px-4 border-t border-b border-border my-1">
                <span className={`text-lg font-semibold ${(currentPrice ?? 0) > (token.current_price ?? 0) ? 'text-green-500' : 'text-red-500'}`}>
                    {currentPrice?.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) ?? '-.--'}
                </span>
            </div>
            {orderBook?.bids && renderOrderBookTable(orderBook.bids, 'Bids')}
          </>
        )}
      </CardContent>
    </Card>
  );
}
