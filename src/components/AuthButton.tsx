
"use client";

import { Button } from "@/components/ui/button";
// import { useAuth } from "@crossmint/client-sdk-react-ui"; // Re-enabled import - Temporarily commented out again due to export error
import { useEffect, useState } from 'react';

export default function AuthButton() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Attempt to use Crossmint auth context, will be null if SDK exports are missing or provider is not set up
    let auth: any = null; 
    let login: (() => void) | undefined = undefined;
    let logout: (() => void) | undefined = undefined;
    let jwt: string | null | undefined = undefined;

    // This try-catch block is a bit of a long shot, as the primary issue is the import itself.
    // If the import fails, useAuth will be undefined.
    // try {
    //     if (isClient) {
    //         // const sdk = require("@crossmint/client-sdk-react-ui"); // Dynamic import not ideal for build/tree-shaking
    //         // if (sdk && sdk.useAuth) {
    //         //     auth = sdk.useAuth();
    //         //     login = auth?.login;
    //         //     logout = auth?.logout;
    //         //     jwt = auth?.jwt;
    //         // }
    //     }
    // } catch (e) {
    //     console.warn("AuthButton: Failed to dynamically access Crossmint useAuth. SDK issue likely.", e);
    //     auth = null; // Ensure auth is null if dynamic access fails
    // }


    if (!isClient) {
        return <Button disabled>Loading Auth...</Button>;
    }

    // If auth context isn't available (due to provider issues or missing useAuth export)
    if (!auth || typeof login !== 'function') { 
        console.warn("AuthButton: Crossmint auth context or login function not available. SDK might not be loading correctly, or CrossmintAuthProvider/useAuth is missing/failing.");
        return <Button disabled>Auth Unavailable (SDK Issue)</Button>;
    }
    
    return !jwt ? (
        <Button onClick={login} disabled={!login}>Login</Button>
    ) : (
        <Button onClick={logout} disabled={!logout}>Logout</Button>
    );
}

