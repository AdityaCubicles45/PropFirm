
'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
// Using CrossmintPayButton as ConnectButton was consistently not found in previous attempts.
// This will also fail if CrossmintProvider is not available.
// import { CrossmintPayButton, useCrossmintWallet } from '@crossmint/client-sdk-react-ui'; // Re-disabled due to persistent export error
import type { CrossmintWalletContextState } from '@crossmint/client-sdk-react-ui'; // Keep type for structure
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast";


const navLinks = [
  { href: "/", label: "Trade" },
  { href: "/docs", label: "Docs" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/community", label: "Community" },
  { href: "/mobile-app", label: "Mobile App" },
];

// Mock CrossmintPayButton if not available
const CrossmintPayButtonFallback = ({ children, className, ...props }: any) => (
  <Button {...props} className={className} disabled>
    {children || "Crossmint Unavailable"}
  </Button>
);
let CrossmintPayButton = CrossmintPayButtonFallback; // Default to fallback

// Mock useCrossmintWallet if not available
const useCrossmintWalletFallback = (): CrossmintWalletContextState | null => null;
let useCrossmintWallet: () => CrossmintWalletContextState | null = useCrossmintWalletFallback;

try {
  // Dynamically try to import, but assume it might fail based on previous errors
  const sdk = require('@crossmint/client-sdk-react-ui');
  if (sdk.CrossmintPayButton) {
    // @ts-ignore
    CrossmintPayButton = sdk.CrossmintPayButton;
  }
  if (sdk.useCrossmintWallet) {
    useCrossmintWallet = sdk.useCrossmintWallet;
  }
} catch (e) {
  console.warn("Crossmint SDK components not fully available. AppHeader may not function correctly.", e);
}


export default function AppHeader() {
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  let walletContext: CrossmintWalletContextState | null = null;
  let crossmintProviderLikelyMissing = false;
  try {
    walletContext = useCrossmintWallet();
  } catch (e) {
    console.warn("useCrossmintWallet hook failed, Crossmint context (CrossmintProvider) might be missing.", e);
    crossmintProviderLikelyMissing = true; // Assume provider is missing if hook fails
  }

  const wallet = walletContext?.wallet;
  const status = walletContext?.status;
  const disconnect = walletContext?.disconnect;
  const crossmintClientId = process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_ID || "";

  const formatAddress = (address: string | undefined | null) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }
  
  const handleDisabledConnectClick = () => {
    toast({
      title: "Crossmint Unavailable",
      description: "Crossmint integration is temporarily disabled. Please try connecting later or check console for details.",
      variant: "destructive",
    });
  };

  const renderConnectButton = () => {
    if (!isClient) {
      return (
        <Button variant="default" size="sm" disabled className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-primary-foreground text-primary hover:bg-primary-foreground/90")}>
          Loading...
        </Button>
      );
    }
    
    const showConfigError = !crossmintClientId && process.env.NODE_ENV !== 'production';

    if (showConfigError || crossmintProviderLikelyMissing) {
      return (
        <Button
          variant="default"
          size="sm"
          onClick={handleDisabledConnectClick}
          title={showConfigError ? "Crossmint Client ID not configured" : "Crossmint Provider potentially missing"}
          className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-primary-foreground text-primary hover:bg-primary-foreground/90 cursor-not-allowed")}
        >
          Connect (Setup Issue)
        </Button>
      );
    }
    
    if (status === 'connected' && wallet?.address) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden md:inline">
            {formatAddress(wallet.address)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => disconnect && disconnect()}
            className="text-sm border-primary text-primary hover:bg-primary/10"
          >
            Disconnect
          </Button>
        </div>
      );
    } else if (status === 'connecting') {
      return (
         <Button variant="default" size="sm" disabled className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-primary-foreground text-primary hover:bg-primary-foreground/90")}>
            Connecting...
          </Button>
      );
    } else { 
      return (
        <Link href="/auth" passHref>
          <Button
            variant="default"
            size="sm"
            className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-primary-foreground text-primary hover:bg-primary-foreground/90")}
          >
            Connect Wallet
          </Button>
        </Link>
      );
    }
  };


  return (
    <header className="bg-card text-card-foreground border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            {/* <Image src="/logo-placeholder.svg" alt="XADE Logo" width={32} height={32} data-ai-hint="logo finance" /> */}
            <h1 className="text-2xl font-bold text-foreground">XADE</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-sm text-muted-foreground hover:text-foreground">
            Add Funds
          </Button>
          {renderConnectButton()}
        </div>
      </div>
    </header>
  );
}
