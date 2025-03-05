
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Wallet, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WalletConnectionProps {
  onSuccess: (address: string) => void;
  onSkip: () => void;
}

const WalletConnection = ({ onSuccess, onSkip }: WalletConnectionProps) => {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    setLoading(true);
    
    try {
      if (typeof window.ethereum === 'undefined') {
        toast.error('MetaMask is not installed! Please install MetaMask to continue.');
        return;
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setConnected(true);
        toast.success('Wallet connected successfully!');
      } else {
        toast.error('Failed to connect wallet. Please try again.');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet. Please try again or skip this step.');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (walletAddress) {
      onSuccess(walletAddress);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-accent/10 mb-4">
          <Wallet className="size-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-muted-foreground">
          Connect your MetaMask wallet to enable cryptocurrency transactions on our platform
        </p>
      </div>
      
      <div className="space-y-4">
        {connected ? (
          <div className="p-4 border rounded-md bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <p className="font-medium">Wallet Connected</p>
                <p className="text-xs text-muted-foreground truncate max-w-[200px]">{walletAddress}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleContinue}
              className="bg-accent text-white border-none hover:bg-accent/90"
            >
              Continue
            </Button>
          </div>
        ) : (
          <Button 
            type="button" 
            className="w-full bg-accent hover:bg-accent/90 transition-all rounded-md h-11 group"
            onClick={connectWallet}
            disabled={loading}
          >
            {loading ? (
              "Connecting..."
            ) : (
              <>
                Connect MetaMask <Wallet className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        )}
        
        <div className="text-center">
          <Button
            type="button"
            variant="ghost"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
            onClick={onSkip}
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Skip this step
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground text-center mt-2 p-2 bg-secondary/50 rounded-md">
          <p>Connecting your wallet is optional but recommended for seamless transactions.</p>
        </div>
      </div>
    </div>
  );
};

export default WalletConnection;
