
import { useState } from 'react';
import { toast } from 'sonner';

interface UseEmailVerificationProps {
  email: string;
  onSuccess?: () => void;
}

export const useEmailVerification = ({ email, onSuccess }: UseEmailVerificationProps) => {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const verifyCode = async (code: string) => {
    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      toast.error('Please enter a valid 6-digit code');
      return false;
    }

    setLoading(true);
    try {
      // Here you'll integrate with your backend API
      const response = await fetch('your-api-endpoint/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Email verified successfully!');
        onSuccess?.();
        return true;
      } else {
        toast.error(data.message || 'Verification failed');
        return false;
      }
    } catch (error) {
      toast.error('Failed to verify code. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      // Here you'll integrate with your backend API
      await fetch('your-api-endpoint/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      toast.success('New verification code sent!');
      setCanResend(false);
      setTimer(60);
    } catch (error) {
      toast.error('Failed to resend code. Please try again.');
    }
  };

  return {
    loading,
    timer,
    canResend,
    verifyCode,
    resendCode,
    setTimer,
    setCanResend
  };
};
