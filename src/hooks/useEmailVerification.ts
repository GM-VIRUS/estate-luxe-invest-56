
import { useState } from 'react';
import { toast } from 'sonner';

interface UseEmailVerificationProps {
  email: string;
  onSuccess: () => void;
}

export const useEmailVerification = ({ email, onSuccess }: UseEmailVerificationProps) => {
  const [otp, setOtp] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const verifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    
    try {
      // Replace with your API endpoint
      const response = await fetch('YOUR_API_ENDPOINT/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: parseInt(otp, 10) }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Email verified successfully!');
        onSuccess();
      } else {
        toast.error(data.message || 'Verification failed');
      }
    } catch (error) {
      toast.error('Failed to verify email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      // Replace with your API endpoint
      const response = await fetch('YOUR_API_ENDPOINT/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success('New verification code sent!');
        setCanResend(false);
        setTimer(60);
      } else {
        toast.error('Failed to send new code');
      }
    } catch (error) {
      toast.error('Failed to send new code');
    }
  };

  return {
    otp,
    setOtp,
    loading,
    timer,
    setTimer,
    canResend,
    setCanResend,
    verifyEmail,
    handleResendOTP,
  };
};
