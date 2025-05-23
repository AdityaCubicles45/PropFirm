
"use client";

import { Button } from "@/components/ui/button";
// import { useAuth } from "@crossmint/client-sdk-react-ui"; // Temporarily commented out due to export error
import { useEffect, useState } from 'react';

export default function AuthButton() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Ensure useAuth is only called client-side and after CrossmintAuthProvider is mounted.
    // The `isClient` check helps, but if `useAuth` is called before provider context is ready, it can throw.
    // A more robust solution might involve checking context readiness if errors persist.
    // const auth = isClient ? useAuth() : null; // Temporarily disabled
    const auth: any = null; // Mock auth context due to SDK issues
    const login = auth?.login;
    const logout = auth?.logout;
    const jwt = auth?.jwt;


    if (!isClient) {
        // Render a placeholder or loading state until client is ready and auth context is available
        return <Button disabled>Loading Auth...</Button>;
    }

    if (!auth) {
        return <Button disabled>Auth Unavailable (SDK Issue)</Button>;
    }
    
    return !jwt ? (
        <Button onClick={login} disabled={!login}>Login with Crossmint</Button>
    ) : (
        <Button onClick={logout} disabled={!logout}>Logout</Button>
    );
}
