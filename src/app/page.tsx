
'use client';

import type { CoinGeckoToken } from '@/lib/types';
import { useState, useEffect } from 'react';
import StatsBar from '@/components/StatsBar';
import TradingChartPlaceholder from '@/components/TradingChartPlaceholder';
import OrderBook from '@/components/OrderBook';
import TradePanel from '@/components/TradePanel';
import AccountSummary from '@/components/AccountSummary';
import PortfolioSummary from '@/components/PortfolioSummary';

// Temporarily use the simple auth page for testing new Crossmint docs.
// Once that's stable, integrate AuthButton/WalletComponent or similar here.
// import AuthButton from "@/components/AuthButton";
// import WalletComponent from "@/components/WalletComponent";

export default function TradingPage() {
  const [selectedToken, setSelectedToken] = useState<CoinGeckoToken | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [simulatedPriceForStatsBar, setSimulatedPriceForStatsBar] = useState<number | null>(null);

  // Simulate price fluctuations for the StatsBar until real price feed is more robust
  useEffect(() => {
    if (selectedToken && selectedToken.current_price) {
      // Initial price for stats bar
      setSimulatedPriceForStatsBar(selectedToken.current_price);
      setCurrentPrice(selectedToken.current_price); // Also set initial currentPrice

      const intervalId = setInterval(() => {
        setSimulatedPriceForStatsBar(prevPrice => {
          if (prevPrice === null) return selectedToken.current_price;
          const change = (Math.random() - 0.5) * (prevPrice * 0.0005); // Smaller fluctuation
          return prevPrice + change;
        });
      }, 2000);
      return () => clearInterval(intervalId);
    } else {
      setSimulatedPriceForStatsBar(null);
      setCurrentPrice(null);
    }
  }, [selectedToken]);

  const handleTokenSelect = (token: CoinGeckoToken | null) => {
    setSelectedToken(token);
    if (token) {
      setCurrentPrice(token.current_price); // Set initial price on new token selection
      setSimulatedPriceForStatsBar(token.current_price);
    } else {
      setCurrentPrice(null);
      setSimulatedPriceForStatsBar(null);
    }
  };

  const handlePriceUpdateFromOrderBook = (price: number | null) => {
    setCurrentPrice(price); // This will be the more "live" price for TradePanel
    if (price !== null) {
         // Optionally, you could also update simulatedPriceForStatsBar here,
         // or keep it slightly different to show a different source if desired.
         // For now, let's keep them potentially distinct to represent different feeds.
         // Or, to make it consistent:
         setSimulatedPriceForStatsBar(price);
    }
  };


  // This page structure implements the new trading UI.
  // If you want to revert to the simple AuthButton/WalletComponent page for testing,
  // replace the content of this return statement with the old Home function's content.
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <StatsBar
        selectedToken={selectedToken}
        onTokenSelect={handleTokenSelect}
        currentPrice={simulatedPriceForStatsBar} // StatsBar uses its own simulated price for now or the one from OB
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

// For testing the Crossmint auth flow as per new docs:
// export default function Home() {
//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
//             <div className="flex flex-col items-center gap-6 p-8 rounded-lg shadow-xl bg-card max-w-md w-full">
//                 <h1 className="text-2xl font-bold mb-4 text-center">XADE Wallet App</h1>
//                 <div className="w-full">
//                   <AuthButton />
//                 </div>
//                 <div className="w-full mt-4">
//                   <WalletComponent />
//                 </div>
//             </div>
//         </div>
//     );
// }
