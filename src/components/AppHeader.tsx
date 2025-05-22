
'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
// Attempting to use CrossmintPayButton as suggested by build errors,
// as CrossmintConnectButton is not found in the installed SDK version.
// import { CrossmintPayButton, useCrossmintWallet } from '@crossmint/client-sdk-react-ui';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: "/trade", label: "Trade" },
  { href: "/docs", label: "Docs" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/community", label: "Community" },
  { href: "/mobile-app", label: "Mobile App" },
];

export default function AppHeader() {
  // Crossmint integration temporarily disabled/modified due to SDK export issues
  // const walletContext = useCrossmintWallet();
  // const wallet = walletContext?.wallet;
  // const status = walletContext?.status;
  // const disconnect = walletContext?.disconnect;

  const crossmintClientId = process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_ID;

  const formatAddress = (address: string | undefined | null) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

  // Placeholder status until SDK issues are resolved
  const status = 'disconnected'; // Mock status
  const wallet = null; // Mock wallet
  const disconnect = () => console.log("Mock disconnect called"); // Mock disconnect

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
          {status === 'connected' && wallet?.address ? (
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
          ) : status === 'connecting' ? (
             <Button variant="default" size="sm" disabled className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-primary-foreground text-primary hover:bg-primary-foreground/90")}>
                Connecting...
              </Button>
          ) : crossmintClientId ? (
            // Using a standard button as CrossmintPayButton/CrossmintConnectButton is causing issues
            <Button
              // clientId={crossmintClientId} // Prop for Crossmint buttons
              // Example: mintConfig={{ type: "erc-721", totalPrice: "0.01", quantity: 1 }}
              // Example: collectionId="YOUR_COLLECTION_ID"
              className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-primary-foreground text-primary hover:bg-primary-foreground/90")}
              onClick={() => alert("Crossmint integration is temporarily disabled. Please try connecting later or check console for details.")}
            >
              Connect Wallet
            </Button>
          ) : (
            <Button variant="default" size="sm" disabled title="Crossmint Client ID not configured" className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-primary-foreground text-primary hover:bg-primary-foreground/90")}>
              Connect (Setup pending)
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
