
'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
// Using CrossmintPayButton as ConnectButton was consistently not found in previous attempts.
// The useCrossmintWallet hook also appears to be unexported in the installed SDK version.
// This will also fail if CrossmintProvider is not available (currently commented out in layout.tsx).
import { CrossmintPayButton } from '@crossmint/client-sdk-react-ui';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';


const navLinks = [
  { href: "/", label: "Trade" },
  { href: "/docs", label: "Docs" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/community", label: "Community" },
  { href: "/mobile-app", label: "Mobile App" },
];

export default function AppHeader() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Gracefully handle missing Crossmint context if Provider is not available or hook is not exported
  let walletContext: any = null; // Default to null
  let useCrossmintWalletHook: any = null; // Placeholder

  try {
    // Attempt to dynamically get the hook if it were available, but it's not imported due to export errors.
    // For now, this path won't execute as intended.
    // walletContext = useCrossmintWalletHook ? useCrossmintWalletHook() : null;
  } catch (e) {
    console.warn("useCrossmintWallet hook failed, likely due to missing CrossmintProvider or the hook not being exported by the SDK.", e);
    // walletContext is already null
  }

  const wallet = walletContext?.wallet;
  const status = walletContext?.status;
  const disconnect = walletContext?.disconnect;
  const crossmintClientId = process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_ID || "";

  const formatAddress = (address: string | undefined | null) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  const renderConnectButton = () => {
    if (!isClient) {
      return (
        <Button variant="default" size="sm" disabled className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-primary-foreground text-primary hover:bg-primary-foreground/90")}>
          Loading...
        </Button>
      );
    }

    if (!crossmintClientId && process.env.NODE_ENV !== 'production') {
      return (
        <Button variant="default" size="sm" disabled title="Crossmint Client ID not configured" className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-primary-foreground text-primary hover:bg-primary-foreground/90")}>
          Connect (Setup pending)
        </Button>
      );
    }
    
    // Since CrossmintProvider is likely commented out and useCrossmintWallet is not exported,
    // walletContext will be null here.
    if (!walletContext) {
        return (
          <Link href="/auth" passHref>
            <Button
              variant="default"
              size="sm"
              className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-primary-foreground text-primary hover:bg-primary-foreground/90")}
              // onClick={() => alert("Crossmint integration is temporarily disabled. Please try connecting later or check console for details.")}
            >
              Connect Wallet
            </Button>
          </Link>
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
    } else { // disconnected or errored
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

