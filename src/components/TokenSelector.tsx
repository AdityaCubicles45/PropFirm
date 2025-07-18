'use client';

import type { CoinGeckoToken } from '@/lib/types';
import { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react'; // Removed Coins icon
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

interface TokenSelectorProps {
  selectedToken: CoinGeckoToken | null;
  onTokenSelect: (token: CoinGeckoToken | null) => void;
}

export default function TokenSelector({ selectedToken, onTokenSelect }: TokenSelectorProps) {
  const [tokens, setTokens] = useState<CoinGeckoToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchTokens() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=300&page=1&sparkline=false');
        if (!response.ok) {
          throw new Error(`Failed to fetch tokens: ${response.statusText}`);
        }
        const data: CoinGeckoToken[] = await response.json();
        setTokens(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTokens();
  }, []);

  if (loading) {
    return <Skeleton className="h-10 w-full md:w-48" />;
  }

  if (error) {
    return <p className="text-xs text-destructive">Error: {error.substring(0,30)}</p>;
  }

  return (
    <div className="w-full md:w-auto">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full md:w-48 justify-between h-10 text-sm bg-card hover:bg-muted border-border focus:ring-1 focus:ring-ring" // Adjusted styling
          >
            {selectedToken ? (
              <div className="flex items-center truncate">
                {selectedToken.image && <Image src={selectedToken.image} alt={selectedToken.name} width={20} height={20} className="mr-2 rounded-full" data-ai-hint="token logo" />}
                <span className="truncate">{selectedToken.name} ({selectedToken.symbol.toUpperCase()})</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Select Token...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0 bg-popover border-border shadow-xl">
          <Command>
            <CommandInput placeholder="Search token..." className="h-9 text-sm" />
            <CommandList>
              <CommandEmpty>No token found.</CommandEmpty>
              <CommandGroup>
                {tokens.map((token) => (
                  <CommandItem
                    key={token.id}
                    value={`${token.name} ${token.symbol} ${token.id}`}
                    onSelect={() => {
                      onTokenSelect(token.id === selectedToken?.id ? null : token);
                      setOpen(false);
                    }}
                    className="flex items-center cursor-pointer text-sm py-2"
                  >
                    {token.image && <Image src={token.image} alt={token.name} width={18} height={18} className="mr-2 rounded-full" data-ai-hint="token logo" />}
                    <span className="flex-1 truncate">{token.name} ({token.symbol.toUpperCase()})</span>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedToken?.id === token.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
