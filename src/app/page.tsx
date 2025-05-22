'use client';

import { useState, useEffect } from 'react';
import type { CoinGeckoToken } from '@/lib/types';
import StatsBar from '@/components/StatsBar';
import TradingChartPlaceholder from '@/components/TradingChartPlaceholder';
import PortfolioSummary from '@/components/PortfolioSummary';
import OrderBook from '@/components/OrderBook';
import AccountSummary from '@/components/AccountSummary';
import TradePanel from '@/components/TradePanel';

export default function TradeFlowPage() {
  const [selectedToken, setSelectedToken] = useState<CoinGeckoToken | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    // Mock: Set Bitcoin as default token on load
    async function fetchInitialToken() {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin');
        if (!response.ok) throw new Error('Failed to fetch initial token');
        const data = await response.json();
        const initialToken: CoinGeckoToken = {
          id: data.id,
          symbol: data.symbol,
          name: data.name,
          image: data.image.thumb,
          current_price: data.market_data.current_price.usd,
          market_cap: data.market_data.market_cap.usd,
          total_volume: data.market_data.total_volume.usd,
          price_change_percentage_24h: data.market_data.price_change_percentage_24h,
        };
        setSelectedToken(initialToken);
        setCurrentPrice(initialToken.current_price);
      } catch (error) {
        console.error("Error fetching initial token:", error);
        // Fallback or error handling if initial token fetch fails
      }
    }
    fetchInitialToken();
  }, []);


  useEffect(() => {
    if (selectedToken) {
      setCurrentPrice(selectedToken.current_price);
      const priceUpdateInterval = setInterval(() => {
        setCurrentPrice(prevPrice => {
          if (prevPrice === null) return selectedToken.current_price;
          // Simulate small price fluctuation
          const changePercentage = (Math.random() - 0.5) * 0.001; // Fluctuate by up to 0.05%
          const changeAmount = prevPrice * changePercentage;
          return prevPrice + changeAmount;
        });
      }, 2000); // Update price every 2 seconds
      return () => clearInterval(priceUpdateInterval);
    } else {
      setCurrentPrice(null);
    }
  }, [selectedToken]);

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,60px))]"> {/* Adjust header height if dynamic */}
      <StatsBar selectedToken={selectedToken} onTokenSelect={setSelectedToken} currentPrice={currentPrice} />
      
      <div className="flex-grow grid grid-cols-1 md:grid-cols-[1fr_auto] lg:grid-cols-[2fr_1fr_1fr] gap-0 border-t border-border overflow-hidden">
        {/* Column 1: Chart & Portfolio Summary */}
        <div className="flex flex-col border-r border-border overflow-y-auto p-1 md:p-2"> {/* Added padding */}
          <div className="flex-grow min-h-[400px] md:min-h-0"> {/* Ensure chart has space */}
            <TradingChartPlaceholder />
          </div>
          <PortfolioSummary />
        </div>

        {/* Column 2: Order Book */}
        <div className="border-r border-border overflow-y-auto p-1 md:p-2 hidden lg:flex flex-col"> {/* Hidden on smaller than lg, padding */}
          <OrderBook token={selectedToken} currentPrice={currentPrice} />
        </div>

        {/* Column 3: Account Summary & Trade Panel */}
        <div className="overflow-y-auto p-1 md:p-2 space-y-2 md:space-y-4"> {/* Padding and spacing */}
          <AccountSummary />
          <TradePanel token={selectedToken} currentPrice={currentPrice} />
          {/* RiskAssessment could be here or in a tab on the chart */}
        </div>
      </div>
    </div>
  );
}
