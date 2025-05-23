
"use client";

// import {
//     CrossmintProvider,
//     // CrossmintAuthProvider, // Already commented out due to previous export errors
// } from "@crossmint/client-sdk-react-ui"; // Imports commented out as they are not found in the SDK
import type { ReactNode } from 'react';

const clientApiKey = process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_KEY;

export default function Providers({ children }: { children: ReactNode }) {
    if (!clientApiKey && process.env.NODE_ENV !== 'production') {
        console.error("Crossmint Client API Key (NEXT_PUBLIC_CROSSMINT_CLIENT_KEY) is not configured. Please set it in your .env file.");
        // Render a message to the user or a fallback UI
        return (
            <>
                <div style={{ padding: '20px', margin: '20px', textAlign: 'center', backgroundColor: 'rgba(255,204,203,0.5)', border: '1px solid red', borderRadius: '8px', color: 'black', fontFamily: 'sans-serif' }}>
                  <h1 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>Crossmint Configuration Error</h1>
                  <p>Crossmint Client API Key (NEXT_PUBLIC_CROSSMINT_CLIENT_KEY) is not set in your .env file.</p>
                  <p>Crossmint features will be unavailable. Please update your .env file and restart the application.</p>
                </div>
                {children}
            </>
        );
    }

    // Since CrossmintProvider and CrossmintAuthProvider are not being exported by the SDK version
    // currently installed (latest -> 1.2.0), we bypass their usage to allow the app to build.
    // This means Crossmint features (login, wallet status) will not work.
    // console.warn("Crossmint SDK exports (CrossmintProvider, CrossmintAuthProvider) not found. Crossmint features are disabled.");
    return <>{children}</>;

    /*
    // Original code structure based on documentation:
    return (
        <CrossmintProvider apiKey={clientApiKey!}> // clientApiKey will be non-null if this path is reached
            <CrossmintAuthProvider
                embeddedWallets={{
                    type: "evm-smart-wallet",
                    defaultChain: "polygon-amoy", // example chain
                    createOnLogin: "all-users",
                }}
            >
                {children}
            </CrossmintAuthProvider>
        </CrossmintProvider>
    );
    */
}
