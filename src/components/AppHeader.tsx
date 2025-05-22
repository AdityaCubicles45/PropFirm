
'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
// Attempting to use CrossmintPayButton as per build system suggestion for latest SDK version
// import { CrossmintPayButton, useCrossmintWallet } from '@crossmint/client-sdk-react-ui'; // Temporarily commented out
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
  // const { wallet, status, disconnect } = useCrossmintWallet() || {}; // Temporarily commented out
  const wallet = null; // Placeholder
  const status = 'disconnected'; // Placeholder
  const disconnect = () => {}; // Placeholder

  const crossmintClientId = process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_ID;


  const formatAddress = (address: string | undefined | null) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  }

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
            // <CrossmintPayButton // Temporarily commented out
            //   clientId={crossmintClientId}
            //   // collectionId="YOUR_COLLECTION_ID" // Example: might be needed for PayButton
            //   // mintConfig={{ type: "erc-721", totalPrice: "0.01", _quantity: 1 }} // Example: might be needed
            //   className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-primary-foreground text-primary hover:bg-primary-foreground/90")}
            // />
             <Button variant="default" size="sm" title="Connect (Crossmint Disabled)" className={cn(buttonVariants({ variant: "default", size: "sm" }), "bg-primary-foreground text-primary hover:bg-primary-foreground/90")}>
              Connect
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
