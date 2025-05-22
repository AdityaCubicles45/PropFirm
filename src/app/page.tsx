'use client';

import { useState, useEffect } from 'react';
import type { CoinGeckoToken } from '@/lib/types';
import TokenSelector from '@/components/TokenSelector';
import PriceDisplay from '@/components/PriceDisplay';
import OrderBook from '@/components/OrderBook';
import TradePanel from '@/components/TradePanel';
import RiskAssessment from '@/components/RiskAssessment';

export default function TradeFlowPage() {
  const [selectedToken, setSelectedToken] = useState<CoinGeckoToken | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  // This effect updates currentPrice whenever selectedToken's price changes.
  // PriceDisplay will also have its own internal "live" price simulation.
  // This ensures TradePanel gets a reasonably up-to-date price.
  useEffect(() => {
    if (selectedToken) {
      setCurrentPrice(selectedToken.current_price);
      // Simulate that the price might update slightly after selection
      const priceUpdateTimeout = setTimeout(() => {
         setCurrentPrice(prev => {
           if (prev === null) return selectedToken.current_price;
           return prev + (Math.random() - 0.5) * (prev * 0.001); // Tiny fluctuation
         });
      }, 1500);
      return () => clearTimeout(priceUpdateTimeout);
    } else {
      setCurrentPrice(null);
    }
  }, [selectedToken]);
  
  // A separate effect to pass price updates from PriceDisplay (mocked live feed) to TradePanel
  // This is a simplified way to handle it. In a real app, a state manager or context would be better.
  useEffect(() => {
    if (selectedToken) {
      const intervalId = setInterval(() => {
        // This is a mock update. In a real app, this would come from a WebSocket or a global state.
        setCurrentPrice(prevPrice => {
          if (prevPrice === null) return selectedToken.current_price;
          const change = (Math.random() - 0.5) * (prevPrice * 0.005);
          return prevPrice + change;
        });
      }, 2000); // Match PriceDisplay's interval for consistency

      return () => clearInterval(intervalId);
    }
  }, [selectedToken]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column (Trading Panel & Risk Assessment) */}
      <div className="lg:col-span-1 space-y-6">
        <TradePanel token={selectedToken} currentPrice={currentPrice} />
        <RiskAssessment tokenName={selectedToken?.name || null} />
      </div>

      {/* Right Column (Token Info & Market Data) */}
      <div className="lg:col-span-2 space-y-6">
        <TokenSelector selectedToken={selectedToken} onTokenSelect={setSelectedToken} />
        {selectedToken && (
          <>
            <PriceDisplay token={selectedToken} />
            <OrderBook token={selectedToken} />
          </>
        )}
        {!selectedToken && (
           <div className="p-6 bg-card rounded-lg shadow-md text-center text-muted-foreground">
            Please select a token to view market data and trading options.
          </div>
        )}
      </div>
    </div>
  );
}
