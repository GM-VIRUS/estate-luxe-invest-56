
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, RefreshCw } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useEmailVerification } from '@/hooks/useEmailVerification';

interface VerificationCodeProps {
  email: string;
  onSuccess: () => void;
}

const VerificationCode = ({ email, onSuccess }: VerificationCodeProps) => {
  const {
    otp,
    setOtp,
    loading,
    timer,
    setTimer,
    canResend,
    setCanResend,
    verifyEmail,
    handleResendOTP,
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
      
      <form onSubmit={verifyEmail} className="space-y-4">
        <div className="space-y-2">
          <InputOTP
            value={otp}
            onChange={(value) => setOtp(value)}
            maxLength={6}
            render={({ slots }) => (
              <InputOTPGroup className="gap-2">
                {slots.map((slot, index) => (
                  <InputOTPSlot key={index} {...slot} />
                ))}
              </InputOTPGroup>
            )}
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

export default VerificationCode;
