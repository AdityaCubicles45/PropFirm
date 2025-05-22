'use client';

import type { CoinGeckoToken, PositionType } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from '@/hooks/use-toast';
import { DollarSign, ShoppingCart, Briefcase } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface TradePanelProps {
  token: CoinGeckoToken | null;
  currentPrice: number | null;
}

export default function TradePanel({ token, currentPrice }: TradePanelProps) {
  const [positionType, setPositionType] = useState<PositionType>('BUY');
  const [amount, setAmount] = useState<string>('');
  const [estimatedCost, setEstimatedCost] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    if (currentPrice !== null && amount) {
      const numericAmount = parseFloat(amount);
      if (!isNaN(numericAmount) && numericAmount > 0) {
        setEstimatedCost(numericAmount * currentPrice);
      } else {
        setEstimatedCost(0);
      }
    } else {
      setEstimatedCost(0);
    }
  }, [amount, currentPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || currentPrice === null) {
      toast({ title: 'Error', description: 'Please select a token and wait for price.', variant: 'destructive' });
      return;
    }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({ title: 'Error', description: 'Please enter a valid amount.', variant: 'destructive' });
      return;
    }

    // Mock trade submission
    console.log({
      token: token.symbol,
      positionType,
      amount: numericAmount,
      entryPrice: currentPrice,
      estimatedCost,
    });

    toast({
      title: 'Trade Submitted!',
      description: `${positionType} ${numericAmount} ${token.symbol.toUpperCase()} @ $${currentPrice.toFixed(2)}`,
    });
    setAmount(''); // Reset amount
  };

  if (!token) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Briefcase className="mr-2 h-5 w-5" />Trade Panel</CardTitle>
          <CardDescription>Select a token to start trading.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center"><Briefcase className="mr-2 h-5 w-5" />Trade {token.name}</CardTitle>
        <CardDescription>Place your buy or sell order.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="market">Market</Label>
            <Input id="market" value={`${token.name} (${token.symbol.toUpperCase()})`} disabled className="mt-1 bg-muted/50" />
          </div>

          <div>
            <Label>Position Type</Label>
            <RadioGroup
              defaultValue="BUY"
              onValueChange={(value) => setPositionType(value as PositionType)}
              className="flex gap-4 mt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BUY" id="buy" />
                <Label htmlFor="buy" className="font-normal cursor-pointer">Buy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SELL" id="sell" />
                <Label htmlFor="sell" className="font-normal cursor-pointer">Sell</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="amount">Amount ({token.symbol.toUpperCase()})</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="any"
              className="mt-1"
            />
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Current Price:</p>
            <p className="text-lg font-semibold">
              {currentPrice !== null ? `$${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}` : <Skeleton className="h-6 w-24 inline-block" />}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Estimated Cost:</p>
            <p className="text-lg font-semibold">
              {currentPrice !== null ? `$${estimatedCost.toFixed(2)}` : <Skeleton className="h-6 w-20 inline-block" />}
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={!token || currentPrice === null || !amount}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {positionType === 'BUY' ? 'Buy' : 'Sell'} {token.symbol.toUpperCase()}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
