'use client';

import type { CoinGeckoToken } from '@/lib/types';
import TokenSelector from '@/components/TokenSelector'; // Assuming TokenSelector is adapted or used as is
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

interface StatsBarProps {
  selectedToken: CoinGeckoToken | null;
  onTokenSelect: (token: CoinGeckoToken | null) => void;
  currentPrice: number | null;
}

const StatItem: React.FC<{ label: string; value: string | number | null; positive?: boolean; negative?: boolean, unit?: string }> = ({ label, value, positive, negative, unit }) => (
  <div className="text-xs">
    <span className="text-muted-foreground">{label}: </span>
    <span className={`font-medium ${positive ? 'text-green-500' : negative ? 'text-red-500' : 'text-foreground'}`}>
      {value ?? 'N/A'} {unit}
    </span>
  </div>
);


export default function StatsBar({ selectedToken, onTokenSelect, currentPrice }: StatsBarProps) {
  // Mock data for stats not available in CoinGeckoToken type or not yet implemented
  const indexPrice = selectedToken ? (selectedToken.current_price * 0.998).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'N/A';
  const change24h = selectedToken?.price_change_percentage_24h;
  const volume24h = selectedToken ? `$${(selectedToken.total_volume / 1000000).toFixed(2)}M` : 'N/A';
  const openInterest = selectedToken ? `$${(selectedToken.market_cap / 10000000).toFixed(2)}M` : 'N/A'; // Mocked
  const fundingRate = selectedToken ? '0.0100%' : 'N/A'; // Mocked

  return (
    <div className="bg-card border-b border-border p-3">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-auto">
          <TokenSelector selectedToken={selectedToken} onTokenSelect={onTokenSelect} />
        </div>
        
        <div className="flex items-center gap-1 md:gap-2 text-lg md:text-xl font-semibold">
            {currentPrice !== null ? (
                <span className={`${(change24h ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
                </span>
            ) : (
                <span className="text-muted-foreground">-.--</span>
            )}
             {change24h !== undefined && change24h !== null && (
                change24h >= 0 ? <TrendingUp className="h-5 w-5 text-green-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />
             )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-row gap-x-4 gap-y-1 md:gap-6 items-center">
          <StatItem label="Index Price" value={indexPrice} />
          <StatItem 
            label="24h Change" 
            value={change24h?.toFixed(2)} 
            unit="%"
            positive={(change24h ?? 0) >= 0}
            negative={(change24h ?? 0) < 0}
          />
          <StatItem label="24h Volume" value={volume24h} />
          <StatItem label="Open Interest" value={openInterest} />
          <StatItem label="Est Funding Rate" value={fundingRate} />
        </div>
      </div>
    </div>
  );
}
