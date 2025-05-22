
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppHeader from '@/components/AppHeader';
import { CrossmintProvider } from '@crossmint/client-sdk-react-ui';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'XADE Trading', // Updated title
  description: 'Advanced Trading Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const crossmintClientId = process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_ID;

  if (!crossmintClientId && process.env.NODE_ENV !== 'production') {
    console.warn("Crossmint Client ID (NEXT_PUBLIC_CROSSMINT_CLIENT_ID) is not set in .env. Crossmint features will be disabled.");
  }

  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <CrossmintProvider clientId={crossmintClientId || ""}>
          <div className="flex flex-col min-h-screen">
            <AppHeader />
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster />
        </CrossmintProvider>
      </body>
    </html>
  );
}
