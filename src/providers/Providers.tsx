
"use client";

import {
    // CrossmintProvider, // Temporarily commented out due to export error from SDK (version 1.2.0)
    // CrossmintAuthProvider, // Temporarily commented out due to export error from SDK (version 1.2.0)
} from "@crossmint/client-sdk-react-ui"; // Re-enabled imports
import type { ReactNode } from 'react';

const clientApiKey = process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_KEY;

export default function Providers({ children }: { children: ReactNode }) {
    if (!clientApiKey && process.env.NODE_ENV !== 'production') {
        console.error("Crossmint Client API Key (NEXT_PUBLIC_CROSSMINT_CLIENT_KEY) is not configured. Please set it in your .env file.");
        // Fallback rendering or just children if critical parts are missing
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
    
    // Temporarily remove CrossmintAuthProvider and CrossmintProvider as they are causing build errors.
    // Authentication will likely not work until this is resolved with a compatible SDK version.
    // return (
    //     <CrossmintProvider apiKey={clientApiKey!}>
    //         {/* <CrossmintAuthProvider
    //             embeddedWallets={{
    //                 type: "evm-smart-wallet",
    //                 defaultChain: "polygon-amoy", // example chain
    //                 createOnLogin: "all-users",
    //             }}
    //         > */}
    //             {children}
    //         {/* </CrossmintAuthProvider> */}
    //     </CrossmintProvider>
    // );
    console.warn("CrossmintProvider and CrossmintAuthProvider are temporarily disabled due to SDK export issues. Crossmint features will be unavailable.");
    return <>{children}</>; // Render children directly without Crossmint providers
}

