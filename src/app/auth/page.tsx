
'use client';

import { useEffect, useState }from 'react';
import { useRouter } from 'next/navigation';
// import { CrossmintConnectButton, useCrossmintWallet } from '@crossmint/client-sdk-react-ui'; // Temporarily disabled
// import type { CrossmintWalletContextState } from '@crossmint/client-sdk-react-ui'; // Temporarily disabled
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Placeholder for CrossmintConnectButton if SDK is not working
const PlaceholderCrossmintConnectButton = (props: any) => (
  <Button
    variant="default"
    size="lg"
    className={cn(props.className, "cursor-not-allowed")}
    disabled
    title="Crossmint integration unavailable"
  >
    Connect Wallet (Unavailable)
  </Button>
);


export default function AuthPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  // Temporarily disable Crossmint hooks due to SDK issues
  // const walletContext = useCrossmintWallet(); 
  const walletContext: any = null; // Mock context

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const status = walletContext?.status;
  const wallet = walletContext?.wallet;
  const crossmintClientId = process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_ID || "";

  useEffect(() => {
    // This redirection will not work as expected if Crossmint SDK is not functional
    if (status === 'connected' && wallet?.address) {
      router.push('/');
    }
  }, [status, wallet, router]);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
             <div role="status" className="flex justify-center">
                <svg aria-hidden="true" className="w-8 h-8 text-muted-foreground animate-spin fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const showConfigError = !crossmintClientId && process.env.NODE_ENV !== 'production';
  // If walletContext is null after client-side rendering, it means CrossmintProvider might be missing or failed to initialize
  const crossmintUnavailable = !walletContext && isClient; 


  if (showConfigError || crossmintUnavailable) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{showConfigError ? "Configuration Error" : "Authentication Unavailable"}</CardTitle>
            <CardDescription>
              {showConfigError 
                ? "Crossmint Client ID is not configured. Please set NEXT_PUBLIC_CROSSMINT_CLIENT_ID in your .env file."
                : "Crossmint integration may be temporarily unavailable or misconfigured. Please check console. The Crossmint SDK might not be loading correctly."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Link href="/" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
              Go to Homepage
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // This 'connected' state is unlikely to be reached if Crossmint SDK is not functional
  if (status === 'connected') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
        <Card className="w-full max-w-md p-6">
           <CardHeader>
            <CardTitle>Connected!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-foreground mb-2">Wallet: {wallet?.address ? `${wallet.address.substring(0, 6)}...${wallet.address.substring(wallet.address.length - 4)}` : 'N/A'}</p>
            <p className="text-muted-foreground mb-4">Redirecting you to the trading dashboard...</p>
            <div role="status" className="flex justify-center">
                <svg aria-hidden="true" className="w-8 h-8 text-muted-foreground animate-spin fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* SVG Path Data */}
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
          <CardDescription>
            Sign in using Crossmint to access the XADE trading platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {status === 'connecting' ? (
            <div className="flex flex-col items-center space-y-2">
              <div role="status" className="flex justify-center">
                  <svg aria-hidden="true" className="w-8 h-8 text-muted-foreground animate-spin fill-primary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <span className="sr-only">Loading...</span>
              </div>
              <p className="text-muted-foreground">Connecting to Crossmint...</p>
            </div>
          ) : (
            // Use PlaceholderCrossmintConnectButton as CrossmintConnectButton might not be available
             <PlaceholderCrossmintConnectButton
                clientId={crossmintClientId}
                className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-12 text-base")}
              />
          )}
           <Link href="/" className={cn(buttonVariants({ variant: "link" }), "text-sm")}>
            Back to Homepage
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
