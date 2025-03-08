
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useState } from "react";

interface VerificationCodeProps {
  length?: number;
  onComplete?: (code: string) => void;
}

const VerificationCode = ({ length = 6, onComplete }: VerificationCodeProps) => {
  const [value, setValue] = useState("");

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (newValue.length === length && onComplete) {
      onComplete(newValue);
    }
  };

  return (
    <InputOTP
      maxLength={length}
      value={value}
      onChange={handleChange}
      render={({ slots }) => (
        <InputOTPGroup>
          {slots.map((slot, index) => (
            <InputOTPSlot
              key={index}
              {...slot}
              index={index}
              className="h-12 w-12 text-lg"
            />
          ))}
        </InputOTPGroup>
      )}
    />
  );
};

export default VerificationCode;
