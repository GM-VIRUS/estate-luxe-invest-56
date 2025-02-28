
import { useState } from "react";
import { X, Mail, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetPassword, setResetPassword] = useState("");
  const [confirmResetPassword, setConfirmResetPassword] = useState("");
  const [resetComplete, setResetComplete] = useState(false);

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Check if email exists
      const mockRegisteredEmail = "user@example.com";
      
      if (email !== mockRegisteredEmail) {
        toast.error("Email not found. Please check your email or sign up.");
        return;
      }
      
      // Simulate sending reset email
      setResetSent(true);
      toast.success("Password reset link sent to your email!");
    }, 1500);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!resetPassword || !confirmResetPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Password match validation
    if (resetPassword !== confirmResetPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(resetPassword)) {
      toast.error("Password must contain at least 8 characters, including uppercase, lowercase, number and special character");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setResetComplete(true);
      
      // Simulate success
      toast.success("Your password has been reset successfully!");
      
      // Close modal after showing success state
      setTimeout(() => {
        handleClose();
      }, 2000);
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    // Reset state after modal is closed
    setTimeout(() => {
      setEmail("");
      setResetPassword("");
      setConfirmResetPassword("");
      setResetSent(false);
      setResetComplete(false);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            {resetSent ? (resetComplete ? "Password Reset Complete" : "Reset Your Password") : "Forgot Password"}
          </DialogTitle>
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {!resetSent ? (
            // Step 1: Enter email for reset link
            <form onSubmit={handleSendResetLink} className="space-y-4 animate-fade-in">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="reset-email" className="block text-sm font-medium">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-accent hover:bg-accent/90 transition-all rounded-md h-11 group"
                disabled={loading}
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    Send Reset Link <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </Button>
            </form>
          ) : !resetComplete ? (
            // Step 2: Reset password form
            <form onSubmit={handleResetPassword} className="space-y-4 animate-fade-in">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Create a new password for your account.
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="new-password" className="block text-sm font-medium">
                  New Password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  className="w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Create a new password"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Min. 8 characters with uppercase, lowercase, number and special character
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirm-new-password" className="block text-sm font-medium">
                  Confirm New Password
                </label>
                <input
                  id="confirm-new-password"
                  type="password"
                  value={confirmResetPassword}
                  onChange={(e) => setConfirmResetPassword(e.target.value)}
                  className="w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Confirm your new password"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-accent hover:bg-accent/90 transition-all rounded-md h-11 group"
                disabled={loading}
              >
                {loading ? (
                  "Resetting..."
                ) : (
                  <>
                    Reset Password <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </Button>
            </form>
          ) : (
            // Step 3: Success message
            <div className="flex flex-col items-center justify-center space-y-4 animate-fade-in">
              <div className="p-6 rounded-full bg-green-500/10 text-green-500">
                <Check className="h-10 w-10" />
              </div>
              <div className="text-center">
                <h3 className="font-medium text-lg">Password Reset Complete</h3>
                <p className="text-sm text-muted-foreground">
                  Your password has been reset successfully. You can now log in with your new password.
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordModal;
