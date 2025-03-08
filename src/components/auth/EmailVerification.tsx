
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw } from 'lucide-react';
import VerificationCode from './VerificationCode';
import { useEmailVerification } from '@/hooks/useEmailVerification';

interface EmailVerificationProps {
  email: string;
  onSuccess: () => void;
}

const EmailVerification = ({ email, onSuccess }: EmailVerificationProps) => {
  const {
    loading,
    timer,
    canResend,
    verifyCode,
    resendCode,
    setTimer,
    setCanResend
  } = useEmailVerification({ email, onSuccess });

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
  }, [timer, canResend, setTimer, setCanResend]);

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
      
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="otp" className="block text-sm font-medium">
            Verification Code
          </label>
          <VerificationCode
            length={6}
            onComplete={verifyCode}
          />
        </div>
      </form>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Didn't receive the code?
        </p>
        <Button
          type="button"
          variant="ghost"
          className="text-sm font-medium text-accent hover:text-accent/80"
          onClick={resendCode}
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
