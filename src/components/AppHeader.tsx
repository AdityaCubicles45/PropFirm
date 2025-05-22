import Link from 'next/link';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: "/trade", label: "Trade" },
  { href: "/docs", label: "Docs" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/community", label: "Community" },
  { href: "/mobile-app", label: "Mobile App" },
];

export default function AppHeader() {
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
          <Button variant="default" size="sm" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
            Connect
          </Button>
        </div>
      </div>
    </header>
  );
}
