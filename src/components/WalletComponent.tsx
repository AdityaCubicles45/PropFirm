
"use client";

import { useWallet } from "@crossmint/client-sdk-react-ui"; // Re-enabled import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from 'react';

function Status() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Re-enabled useWallet usage
    const walletContext = isClient ? useWallet() : null; 

    const wallet = walletContext?.wallet;
    const status = walletContext?.status;
    const error = walletContext?.error;

    if (!isClient) {
         return <div className="text-zinc-400">Loading wallet status...</div>;
    }

    if (!walletContext) { // This might be hit if CrossmintProvider fails to initialize or is not found
        console.warn("WalletComponent: Crossmint wallet context not available. SDK might not be loading correctly or CrossmintProvider is missing/failing.");
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
