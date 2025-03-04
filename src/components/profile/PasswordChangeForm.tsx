
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@/components/ui/dialog";
import { Eye, EyeOff, Check, X, Loader2 } from "lucide-react";

const PasswordChangeForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'verify' | 'change'>('verify');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const verifyCurrentPassword = () => {
    if (!formData.currentPassword) {
      setErrors(prev => ({
        ...prev,
        currentPassword: 'Current password is required'
      }));
      return;
    }

    setIsLoading(true);
    
    // Simulate API verification
    setTimeout(() => {
      // In a real app, we'd verify against the backend
      // For this demo, we'll just accept "password" as the valid password
      if (formData.currentPassword === "password") {
        setStep('change');
        setIsLoading(false);
      } else {
        setErrors(prev => ({
          ...prev,
          currentPassword: 'Incorrect password'
        }));
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    let isValid = true;
    const newErrors = { ...errors };
    
    if (step === 'verify') {
      verifyCurrentPassword();
      return;
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    if (!isValid) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully changed.",
      });
      
      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setStep('verify');
      
      // Close dialog
      document.querySelector('[data-state="open"] button[data-state="closed"]')?.click();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      {step === 'verify' ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={handleInputChange}
                className={`pr-10 transition-all duration-200 focus:ring-2 focus:ring-accent ${errors.currentPassword ? 'border-destructive focus:ring-destructive' : ''}`}
                placeholder="Enter your current password"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-destructive animate-fade-in">
                {errors.currentPassword}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Hint for demo: the current password is "password"
            </p>
          </div>
          
          <div className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="button" 
              onClick={verifyCurrentPassword}
              disabled={isLoading}
              className="transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={handleInputChange}
                className={`pr-10 transition-all duration-200 focus:ring-2 focus:ring-accent ${errors.newPassword ? 'border-destructive focus:ring-destructive' : ''}`}
                placeholder="Enter your new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-sm text-destructive animate-fade-in">
                {errors.newPassword}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`pr-10 transition-all duration-200 focus:ring-2 focus:ring-accent ${errors.confirmPassword ? 'border-destructive focus:ring-destructive' : ''}`}
                placeholder="Confirm your new password"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive animate-fade-in">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep('verify')}
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default PasswordChangeForm;
