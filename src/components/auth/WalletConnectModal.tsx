
import { useState, useEffect } from "react";
import { Check, Loader2, Wallet, X, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export type ModalView = "walletConnect" | "emailVerification" | "success";

const WalletConnectModal = ({ isOpen, onClose, onConnect }: WalletConnectModalProps) => {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [currentView, setCurrentView] = useState<ModalView>("walletConnect");
  
  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setConnecting(false);
      setConnected(false);
      setCurrentView("walletConnect");
    }
  }, [isOpen]);
  
  const handleConnectWallet = async () => {
    setConnecting(true);
    
    // Simulate wallet connection
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
      
      // After showing success state for a moment, show email verification
      setTimeout(() => {
        setCurrentView("emailVerification");
      }, 1500);
    }, 2000);
  };

  const handleEmailVerified = () => {
    setCurrentView("success");
    
    // After showing success message, close modal and notify parent
    setTimeout(() => {
      onConnect();
    }, 2000);
  };

  const renderContent = () => {
    switch (currentView) {
      case "walletConnect":
        return (
          <>
            {!connected ? (
              <>
                <div className="p-6 rounded-full bg-accent/10 text-accent">
                  <Wallet className="h-10 w-10" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-medium text-lg">Wallet Connection Required</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Connect your wallet to complete the authentication process and access your account.
                  </p>
                </div>
                <div className="flex flex-col space-y-3 w-full">
                  <Button
                    onClick={handleConnectWallet}
                    className="w-full flex items-center justify-center h-11 bg-accent hover:bg-accent/90 text-white"
                    disabled={connecting}
                  >
                    {connecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
                      </>
                    ) : (
                      <>Connect MetaMask</>
                    )}
                  </Button>
                  <Button
                    onClick={handleConnectWallet}
                    variant="outline"
                    className="w-full h-11"
                    disabled={connecting}
                  >
                    {connecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
                      </>
                    ) : (
                      <>WalletConnect</>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
                <div className="p-6 rounded-full bg-green-500/10 text-green-500">
                  <Check className="h-10 w-10" />
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-lg">Wallet Connected!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your wallet has been successfully connected.
                  </p>
                </div>
              </div>
            )}
          </>
        );
      case "emailVerification":
        return (
          <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
            <div className="p-6 rounded-full bg-accent/10 text-accent">
              <Mail className="h-10 w-10" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">Verify Your Email</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
              </p>
            </div>
            <div className="w-full space-y-3 pt-2">
              <Button 
                onClick={handleEmailVerified} 
                className="w-full bg-accent hover:bg-accent/90"
              >
                I've Verified My Email
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setCurrentView("walletConnect")}
              >
                Go Back
              </Button>
            </div>
          </div>
        );
      case "success":
        return (
          <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
            <div className="p-6 rounded-full bg-green-500/10 text-green-500">
              <Check className="h-10 w-10" />
            </div>
            <div className="text-center">
              <h3 className="font-medium text-lg">Account Successfully Created!</h3>
              <p className="text-sm text-muted-foreground">
                Your account has been verified and created successfully. You can now log in.
              </p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {currentView === "walletConnect" ? "Connect Your Wallet" : 
             currentView === "emailVerification" ? "Email Verification" : 
             "Account Created"}
          </DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
            {renderContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectModal;
