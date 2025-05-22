'use client';

import type { CoinGeckoToken, PositionType } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

interface TradePanelProps {
  token: CoinGeckoToken | null;
  currentPrice: number | null;
}

export default function TradePanel({ token, currentPrice }: TradePanelProps) {
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [positionType, setPositionType] = useState<PositionType>('BUY'); // BUY for Long, SELL for Short
  const [orderValue, setOrderValue] = useState<string>(''); // e.g., 100 for 100 USDC
  const [orderValueCurrency, setOrderValueCurrency] = useState<'USDC' | 'BTC'>('USDC'); // Assuming BTC is the token symbol
  
  const { toast } = useToast();

  const estimatedEntryPrice = currentPrice;
  const fees = token && orderValue && currentPrice ? (parseFloat(orderValue) * 0.0006).toFixed(2) + ' USDC' : '0.00 USDC'; // Mock fee
  const orderSize = token && orderValue && currentPrice ? (parseFloat(orderValue) / currentPrice).toFixed(8) + ` ${token.symbol.toUpperCase()}` : `0.00000000 ${token?.symbol.toUpperCase() || 'TOKEN'}`;
  const liquidationPrice = '$0.00'; // Mocked

  useEffect(() => {
    if (token) {
      setOrderValueCurrency(token.symbol.toUpperCase() as 'USDC' | 'BTC'); // Default to token currency if not USDC
    }
  }, [token]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || currentPrice === null) {
      toast({ title: 'Error', description: 'Please select a token and wait for price.', variant: 'destructive' });
      return;
    }
    const numericAmount = parseFloat(orderValue);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast({ title: 'Error', description: 'Please enter a valid order value.', variant: 'destructive' });
      return;
    }

    toast({
      title: 'Trade Submitted!',
      description: `${positionType} ${orderSize} @ Market Price (Est. $${currentPrice.toFixed(2)})`,
      variant: 'default'
    });
    setOrderValue('');
  };

  if (!token) {
    return (
      <Card className="shadow-md mt-4">
        <CardHeader className="pt-4 pb-2 px-4">
          <CardTitle className="text-sm font-medium">TRADE</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <Skeleton className="h-8 w-full mb-3" />
          <Skeleton className="h-8 w-full mb-3" />
          <Skeleton className="h-10 w-full mb-3" />
          <Skeleton className="h-10 w-full" />
          <div className="text-center text-xs text-muted-foreground mt-4">Select a token to trade.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md mt-4">
       <CardHeader className="p-0">
        <Tabs defaultValue="MARKET" onValueChange={(value) => setOrderType(value as 'MARKET' | 'LIMIT')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-none rounded-t-lg h-10 text-xs p-0">
            <TabsTrigger value="MARKET" className="rounded-none data-[state=active]:bg-secondary data-[state=active]:text-foreground h-full data-[state=active]:border-b-2 data-[state=active]:border-primary">MARKET</TabsTrigger>
            <TabsTrigger value="LIMIT" className="rounded-none data-[state=active]:bg-secondary data-[state=active]:text-foreground h-full data-[state=active]:border-b-2 data-[state=active]:border-primary">LIMIT</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="px-4 pt-4 pb-3 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button 
              type="button" 
              variant={positionType === 'BUY' ? 'default' : 'secondary'}
              className={`w-full h-9 text-sm ${positionType === 'BUY' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-muted hover:bg-muted/80'}`}
              onClick={() => setPositionType('BUY')}
            >
              BUY/LONG
            </Button>
            <Button 
              type="button"
              variant={positionType === 'SELL' ? 'default' : 'secondary'}
              className={`w-full h-9 text-sm ${positionType === 'SELL' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-muted hover:bg-muted/80'}`}
              onClick={() => setPositionType('SELL')}
            >
              SELL/SHORT
            </Button>
          </div>
          
          <div>
            <Label htmlFor="orderValue" className="text-xs">Order value</Label>
            <div className="flex items-center mt-1">
              <Input
                id="orderValue"
                type="number"
                placeholder="0.00"
                value={orderValue}
                onChange={(e) => setOrderValue(e.target.value)}
                min="0"
                step="any"
                className="h-9 text-sm rounded-r-none"
              />
              <Tabs defaultValue={orderValueCurrency} onValueChange={(val) => setOrderValueCurrency(val as 'USDC' | 'BTC')} className="w-auto">
                <TabsList className="grid grid-cols-2 h-9 p-0 rounded-l-none">
                    <TabsTrigger value="USDC" className="px-2.5 text-xs rounded-none data-[state=active]:bg-secondary data-[state=active]:text-foreground h-full w-full">USDC</TabsTrigger>
                    <TabsTrigger value={token.symbol.toUpperCase()} className="px-2.5 text-xs rounded-none rounded-r-md data-[state=active]:bg-secondary data-[state=active]:text-foreground h-full w-full">{token.symbol.toUpperCase()}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {orderType === 'LIMIT' && (
            <div>
                <Label htmlFor="limitPrice" className="text-xs">Limit Price (USD)</Label>
                <Input id="limitPrice" type="number" placeholder={currentPrice?.toFixed(2) || "0.00"} className="mt-1 h-9 text-sm" />
            </div>
          )}

          <div className="space-y-0.5 text-xs border-t border-border pt-2 mt-2">
            <div className="flex justify-between"><span className="text-muted-foreground">Order Size:</span> <span>{orderSize}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Market:</span> <span>{token.symbol.toUpperCase()}/USD</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Est. Entry Price:</span> <span>{estimatedEntryPrice !== null ? `$${estimatedEntryPrice.toFixed(2)}` : 'N/A'}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Liquidation Price:</span> <span>{liquidationPrice}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Fees:</span> <span>{fees}</span></div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button 
            type="submit" 
            className={`w-full h-10 text-sm font-semibold ${positionType === 'BUY' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
            disabled={!token || currentPrice === null || !orderValue}
          >
            {positionType === 'BUY' ? 'Buy' : 'Sell'} {token.symbol.toUpperCase()}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
