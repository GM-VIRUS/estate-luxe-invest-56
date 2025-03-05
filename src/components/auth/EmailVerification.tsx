
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface EmailVerificationProps {
  email: string;
  onSuccess: () => void;
}

const EmailVerification = ({ email, onSuccess }: EmailVerificationProps) => {
  const { verifyEmail } = useAuth();
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    
    if (timer > 0 && !canResend) {
      interval = window.setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await verifyEmail(email, parseInt(otp, 10));
      
      if (success) {
        toast.success('Email verified successfully!');
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = () => {
    toast.info('New verification code sent to your email');
    setCanResend(false);
    setTimer(60);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center size-16 rounded-full bg-accent/10 mb-4">
          <Mail className="size-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Verify Your Email</h2>
        <p className="text-muted-foreground">
          We've sent a verification code to<br />
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>
      
      <form onSubmit={handleVerify} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="otp" className="block text-sm font-medium">
            Verification Code
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.slice(0, 6))}
            className="w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Enter 6-digit code"
            maxLength={6}
            autoComplete="one-time-code"
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-accent hover:bg-accent/90 transition-all rounded-md h-11 group"
          disabled={loading}
        >
          {loading ? (
            "Verifying..."
          ) : (
            <>
              Verify Email <CheckCircle className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Didn't receive the code?
        </p>
        <Button
          type="button"
          variant="ghost"
          className="text-sm font-medium text-accent hover:text-accent/80"
          onClick={handleResendOTP}
          disabled={!canResend}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          {canResend ? 'Resend Code' : `Resend in ${timer}s`}
        </Button>
      </div>
    </div>
  );
};

export default EmailVerification;
