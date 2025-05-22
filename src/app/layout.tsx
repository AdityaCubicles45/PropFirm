
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

  if (!crossmintClientId) {
    console.warn("Crossmint Client ID is not set. Crossmint features will be disabled.");
    // Potentially render a fallback or a restricted version of the app
    // For now, we proceed but CrossmintProvider might not work as expected.
  }

  return (
    // Applying dark theme globally by default as per new globals.css
    // If a toggle was desired, className="dark" would be conditional here.
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <CrossmintProvider clientId={crossmintClientId || ""}>
          <div className="flex flex-col min-h-screen">
            <AppHeader />
            {/* Removed container mx-auto for full-width layout as in the image */}
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
