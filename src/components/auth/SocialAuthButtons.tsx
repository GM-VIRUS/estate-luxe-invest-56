
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Apple, Twitter } from "lucide-react";

interface SocialAuthButtonsProps {
  onSuccess: () => void;
}

const SocialAuthButtons = ({ onSuccess }: SocialAuthButtonsProps) => {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSocialAuth = (provider: string) => {
    setLoadingProvider(provider);
    
    // Simulate social authentication
    setTimeout(() => {
      setLoadingProvider(null);
      
      // Simulate successful authentication
      if (Math.random() > 0.2) {
        toast.success(`Successfully authenticated with ${provider}`);
        onSuccess();
      } else {
        // Simulate error (e.g., user canceled or auth failed)
        toast.error(`Authentication with ${provider} failed. Please try again.`);
      }
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 relative overflow-hidden group button-hover"
        onClick={() => handleSocialAuth("Google")}
        disabled={loadingProvider !== null}
      >
        {loadingProvider === "Google" ? (
          "Connecting..."
        ) : (
          <>
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </>
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full h-11 relative overflow-hidden group button-hover"
        onClick={() => handleSocialAuth("Apple")}
        disabled={loadingProvider !== null}
      >
        {loadingProvider === "Apple" ? (
          "Connecting..."
        ) : (
          <>
            <Apple className="h-5 w-5 mr-2" />
            Continue with Apple
          </>
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        className="w-full h-11 relative overflow-hidden group button-hover"
        onClick={() => handleSocialAuth("Twitter")}
        disabled={loadingProvider !== null}
      >
        {loadingProvider === "Twitter" ? (
          "Connecting..."
        ) : (
          <>
            <Twitter className="h-5 w-5 mr-2" />
            Continue with Twitter
          </>
        )}
      </Button>
    </div>
  );
};

export default SocialAuthButtons;
