'use client';

import type { CoinGeckoToken } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, TrendingUp, TrendingDown } from 'lucide-react';

interface PriceDisplayProps {
  token: CoinGeckoToken | null;
}

export default function PriceDisplay({ token }: PriceDisplayProps) {
  const [price, setPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0); // For color indication

  useEffect(() => {
    if (token) {
      // Initial price from CoinGecko data if available
      setPrice(token.current_price);
      
      // Mock real-time price updates
      const intervalId = setInterval(() => {
        setPrice(prevPrice => {
          if (prevPrice === null) return token.current_price; // Initialize if null
          const change = (Math.random() - 0.5) * (prevPrice * 0.005); // Simulate small price fluctuation
          const newPrice = prevPrice + change;
          setPriceChange(change);
          return newPrice;
        });
      }, 2000); // Update every 2 seconds

      return () => clearInterval(intervalId);
    } else {
      setPrice(null);
      setPriceChange(0);
    }
  }, [token]);

  if (!token) {
    return (
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Live Price</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <Skeleton className="h-8 w-32" />
          </div>
          <p className="text-xs text-muted-foreground">Select a token to see live price</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {token.name} ({token.symbol.toUpperCase()}) Price
        </CardTitle>
        {priceChange >= 0 ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />}
      </CardHeader>
      <CardContent>
        {price === null ? (
          <Skeleton className="h-8 w-32" />
        ) : (
          <div className={`text-2xl font-bold ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Market Cap: ${token.market_cap?.toLocaleString() || 'N/A'}
        </p>
      </CardContent>
    </Card>
  );
}
