
// This page is simplified to demonstrate the new Crossmint auth flow as per the documentation.
// The previous trading UI has been temporarily replaced.
import AuthButton from "@/components/AuthButton";
import WalletComponent from "@/components/WalletComponent";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
            <div className="flex flex-col items-center gap-6 p-8 rounded-lg shadow-xl bg-card max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4 text-center">XADE Wallet App</h1>
                <div className="w-full">
                  <AuthButton />
                </div>
                <div className="w-full mt-4">
                  <WalletComponent />
                </div>
            </div>
        </div>
    );
}
