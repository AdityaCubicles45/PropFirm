
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
// Crossmint specific imports are removed as auth is handled by AuthButton.tsx on the main page now.
// import { cn } from '@/lib/utils';
// import { useEffect, useState } from 'react';
// import { useToast } from "@/hooks/use-toast";


const navLinks = [
  { href: "/", label: "Trade" }, // Will now point to the simplified auth demo page
  { href: "/docs", label: "Docs" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/community", label: "Community" },
  { href: "/mobile-app", label: "Mobile App" },
];


export default function AppHeader() {
  // const [isClient, setIsClient] = useState(false);
  // const { toast } = useToast();
  
  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  // Old Crossmint logic is removed. The new AuthButton component will handle login/logout.
  // This header can be simplified or later reintegrate wallet display if needed.

  return (
    <header className="bg-card text-card-foreground border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
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
          {/* 
            The AuthButton is now on the main page (src/app/page.tsx).
            If you want a login/logout button in the header, you could place <AuthButton /> here.
            For this iteration, to strictly follow the new docs, it's on page.tsx.
          */}
           <Link href="/" passHref>
            <Button variant="default" size="sm" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              Login/Status
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
