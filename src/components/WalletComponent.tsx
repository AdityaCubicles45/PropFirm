
"use client";

// import { useWallet } from "@crossmint/client-sdk-react-ui"; // Temporarily disabled due to SDK export issues
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from 'react';

function Status() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Attempt to use Crossmint wallet context
    let walletContext: any | null = null; // Use 'any' as useWallet is not being imported
    try {
        if (isClient) { 
            // walletContext = useWallet(); // This line would cause an error if useWallet is not defined or CrossmintProvider is missing
            // Since useWallet is not imported due to export errors, walletContext remains null.
        }
    } catch (e) {
        console.warn("WalletComponent: Failed to access Crossmint useWallet. SDK issue likely, or CrossmintProvider is missing/failing.", e);
        walletContext = null; // Ensure walletContext is null if access fails
    }
    
    const wallet = walletContext?.wallet;
    const status = walletContext?.status;
    const error = walletContext?.error;

    if (!isClient) {
         return <div className="text-zinc-400">Loading wallet status...</div>;
    }

    if (!walletContext) { 
        console.warn("WalletComponent: Crossmint useWallet hook not available or CrossmintProvider is missing/failing. SDK might not be loading correctly.");
        return <div className="text-orange-500">Wallet features unavailable (SDK issue).</div>;
    }

    if (status === "loading-error") {
        return <div className="text-rose-500">Error: {error?.message || 'Unknown error loading wallet.'}</div>;
    }

    if (status === "in-progress") {
        return <div className="text-amber-500">Loading wallet...</div>;
    }

    if (status === "loaded" && wallet) {
        return <div className="text-emerald-600">Connected: {wallet.address}</div>;
    }

    return <div className="text-zinc-400">Wallet not connected</div>;
}

export default function WalletComponent() {
    return (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Wallet Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Status />
          </CardContent>
        </Card>
    );
}

