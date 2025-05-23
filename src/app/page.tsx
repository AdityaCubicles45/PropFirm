
'use client';

import type { CoinGeckoToken } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';
import StatsBar from '@/components/StatsBar';
import TradingChartPlaceholder from '@/components/TradingChartPlaceholder';
import OrderBook from '@/components/OrderBook';
import TradePanel from '@/components/TradePanel';
import AccountSummary from '@/components/AccountSummary';
import PortfolioSummary from '@/components/PortfolioSummary';

export default function TradingPage() {
  const [selectedToken, setSelectedToken] = useState<CoinGeckoToken | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  const handleTokenSelect = (token: CoinGeckoToken | null) => {
    setSelectedToken(token);
    if (token) {
      setCurrentPrice(token.current_price); // Set initial price from CoinGecko
    } else {
      setCurrentPrice(null);
    }
  };

  // Callback for OrderBook to update the current price
  const handlePriceUpdateFromOrderBook = useCallback((price: number | null) => {
    setCurrentPrice(price);
  }, []);


  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <StatsBar
        selectedToken={selectedToken}
        onTokenSelect={handleTokenSelect}
        currentPrice={currentPrice} 
      />
      <div className="flex-grow flex p-2 gap-2 overflow-hidden">
        {/* Left Column */}
        <div className="flex flex-col w-[20%] min-w-[250px] gap-2">
          <div className="flex-shrink-0">
            <AccountSummary />
          </div>
          <div className="flex-grow min-h-0">
            {/* Placeholder for another component or can be part of portfolio */}
          </div>
        </div>

        {/* Middle Column (Main Area) */}
        <div className="flex flex-col flex-grow gap-2">
          <div className="h-[60%] min-h-[300px]">
            <TradingChartPlaceholder />
          </div>
          <div className="flex-grow min-h-0">
            <PortfolioSummary />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col w-[25%] min-w-[300px] gap-2">
          <div className="h-[65%] min-h-[300px]">
             <OrderBook token={selectedToken} onPriceUpdate={handlePriceUpdateFromOrderBook} currentPrice={currentPrice} />
          </div>
          <div className="flex-shrink-0">
            <TradePanel token={selectedToken} currentPrice={currentPrice} />
          </div>
        </div>
      </div>
    </div>
  );
}
