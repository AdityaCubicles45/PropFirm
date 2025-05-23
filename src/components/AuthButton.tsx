
"use client";

import { Button } from "@/components/ui/button";
// import { useAuth } from "@crossmint/client-sdk-react-ui"; // Temporarily disabled due to SDK export issues
import { useEffect, useState } from 'react';

export default function AuthButton() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Attempt to use Crossmint auth context
    let auth: any | null = null; // Use 'any' as useAuth is not being imported
    try {
        if (isClient) {
            // auth = useAuth(); // This line would cause an error if useAuth is not defined or CrossmintAuthProvider is missing
            // Since useAuth is not imported due to export errors, auth remains null.
        }
    } catch (e) {
        console.warn("AuthButton: Failed to access Crossmint useAuth. SDK issue likely, or CrossmintAuthProvider is missing/failing.", e);
        auth = null; // Ensure auth is null if access fails
    }
    
    const login = auth?.login;
    const logout = auth?.logout;
    const jwt = auth?.jwt;

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

