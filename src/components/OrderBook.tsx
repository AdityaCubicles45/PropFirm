'use client';

import type { CoinGeckoToken, OrderBookData, OrderBookEntry } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUpDown } from 'lucide-react';

interface OrderBookProps {
  token: CoinGeckoToken | null;
}

const generateMockOrderBookData = (basePrice: number): OrderBookData => {
  const bids: OrderBookEntry[] = [];
  const asks: OrderBookEntry[] = [];
  const numEntries = 10;

  for (let i = 0; i < numEntries; i++) {
    bids.push({
      price: basePrice - (i + 1) * (basePrice * 0.001) * (Math.random() * 0.5 + 0.75), // Bids slightly lower
      quantity: Math.random() * 10 + 1,
    });
    asks.push({
      price: basePrice + (i + 1) * (basePrice * 0.001) * (Math.random() * 0.5 + 0.75), // Asks slightly higher
      quantity: Math.random() * 10 + 1,
    });
  }
  // Sort bids descending, asks ascending
  bids.sort((a, b) => b.price - a.price);
  asks.sort((a, b) => a.price - b.price);
  return { bids, asks };
};


export default function OrderBook({ token }: OrderBookProps) {
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && token.current_price) {
      setLoading(true);
      // Initial mock data
      setOrderBook(generateMockOrderBookData(token.current_price));
      setLoading(false);

      // Mock real-time updates
      const intervalId = setInterval(() => {
        setOrderBook(prevOrderBook => {
          if (prevOrderBook && token.current_price) {
             // Simple update: regenerate based on current token price or slightly adjust existing prices/quantities
            return generateMockOrderBookData(token.current_price + (Math.random() - 0.5) * token.current_price * 0.001);
          }
          return prevOrderBook;
        });
      }, 3000); // Update every 3 seconds

      return () => clearInterval(intervalId);
    } else {
      setOrderBook(null);
    }
  }, [token]);

  if (!token) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Order Book</CardTitle>
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
          <p className="text-xs text-muted-foreground mt-2">Select a token to see the order book.</p>
        </CardContent>
      </Card>
    );
  }
  
  const renderOrderBookTable = (entries: OrderBookEntry[], type: 'Bids' | 'Asks') => (
    <div className="flex-1">
      <h3 className={`text-lg font-semibold mb-2 ${type === 'Bids' ? 'text-green-500' : 'text-red-500'}`}>{type}</h3>
      <Table className="text-xs">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Price (USD)</TableHead>
            <TableHead className="w-[50%] text-right">Amount ({token.symbol.toUpperCase()})</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={`skeleton-${type}-${i}`}>
              <TableCell><Skeleton className="h-4 w-full" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-4 w-full" /></TableCell>
            </TableRow>
          ))}
          {!loading && entries.map((entry, index) => (
            <TableRow key={`${type}-${index}`}>
              <TableCell className={`${type === 'Bids' ? 'text-green-600' : 'text-red-600'}`}>
                {entry.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
              </TableCell>
              <TableCell className="text-right">{entry.quantity.toFixed(4)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );


  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{token.name} Order Book</CardTitle>
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        { !orderBook && !loading ? (
          <p>No order book data available.</p>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 max-h-[400px] overflow-y-auto">
            {orderBook?.bids && renderOrderBookTable(orderBook.bids, 'Bids')}
            {orderBook?.asks && renderOrderBookTable(orderBook.asks, 'Asks')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
