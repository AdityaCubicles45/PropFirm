
"use client";

// import { useWallet } from "@crossmint/client-sdk-react-ui"; // Temporarily commented out due to export error
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from 'react';

function Status() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Ensure useWallet is only called client-side and after CrossmintProvider is mounted.
    // const walletContext = isClient ? useWallet() : null; // Temporarily disabled
    const walletContext: any = null; // Mock context due to SDK issues

    const wallet = walletContext?.wallet;
    const status = walletContext?.status;
    const error = walletContext?.error;

    if (!isClient) {
         return <div className="text-zinc-400">Loading wallet status...</div>;
    }

    if (!walletContext) {
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
