
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Apple } from "lucide-react";

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
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.9999 5.9998C21.2641 6.32779 20.4733 6.55331 19.6439 6.6598C20.4908 6.13849 21.1411 5.31816 21.4471 4.3598C20.6537 4.82982 19.7754 5.16533 18.8414 5.3498C18.0935 4.5368 17.0271 4.0498 15.8466 4.0498C13.5807 4.0498 11.7434 5.88717 11.7434 8.15295C11.7434 8.47289 11.7793 8.78179 11.8487 9.0768C8.43985 8.9078 5.41534 7.27906 3.3924 4.83966C3.04022 5.43709 2.83704 6.13843 2.83704 6.88975C2.83704 8.30953 3.56126 9.56837 4.66227 10.2928C3.98897 10.2712 3.35705 10.0868 2.80384 9.78935V9.84121C2.80384 11.8316 4.21755 13.4824 6.09486 13.8592C5.75268 13.9532 5.38926 14.0008 5.0134 14.0008C4.75384 14.0008 4.50126 13.976 4.25666 13.9288C4.76782 15.5512 6.27984 16.7218 8.07405 16.7548C6.67035 17.8438 4.90063 18.4862 2.97866 18.4862C2.64785 18.4862 2.32402 18.4678 2.00008 18.4308C3.81619 19.5808 5.97226 20.2498 8.28986 20.2498C15.8366 20.2498 19.9646 14.0685 19.9646 8.69495L19.9503 8.16605C20.7556 7.57851 21.4495 6.8384 21.9999 5.9998Z" />
            </svg>
            Continue with Twitter
          </>
        )}
      </Button>
    </div>
  );
};

export default SocialAuthButtons;
