
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Mail, Lock, User } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import EmailVerification from "@/components/auth/EmailVerification";
import WalletConnection from "@/components/auth/WalletConnection";
import SignupSuccess from "@/components/auth/SignupSuccess";

// Step definitions
enum SignupStep {
  AccountInfo = 0,
  WalletConnection = 1,
  EmailVerification = 2,
  Success = 3
}

const Signup = () => {
  const navigate = useNavigate();
  const { signup, login } = useAuth();
  
  // Current step
  const [currentStep, setCurrentStep] = useState<SignupStep>(SignupStep.AccountInfo);
  
  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // States
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [shakingFields, setShakingFields] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(5);
  
  // Handle countdown for success page
  useEffect(() => {
    if (currentStep === SignupStep.Success && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, countdown]);

  // Field validation
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "firstName":
      case "lastName":
        return value.trim() ? "" : "This field is required";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !value ? "Email is required" :
               !emailRegex.test(value) ? "Please enter a valid email address" : "";
      case "password":
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return !value ? "Password is required" :
               !passwordRegex.test(value) ? "Password must contain at least 8 characters, including uppercase, lowercase, number and special character" : "";
      case "confirmPassword":
        return !value ? "Please confirm your password" :
               value !== password ? "Passwords do not match" : "";
      default:
        return "";
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const fields = {
      firstName,
      lastName, 
      email,
      password,
      confirmPassword
    };
    
    const newErrors: Record<string, string> = {};
    const invalidFields: string[] = [];
    
    Object.entries(fields).forEach(([field, value]) => {
      const error = validateField(field, value);
      if (error) {
        newErrors[field] = error;
        invalidFields.push(field);
      }
    });
    
    setFormErrors(newErrors);
    
    if (invalidFields.length > 0) {
      setShakingFields(invalidFields);
      setTimeout(() => setShakingFields([]), 500);
      return false;
    }
    
    return true;
  };

  // Handle account creation
  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await signup(email, password, firstName, lastName);
      
      if (success) {
        toast.success("Account created! Please verify your email.");
        setCurrentStep(SignupStep.WalletConnection);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle wallet connection
  const handleWalletConnected = (address: string) => {
    // Store the wallet address for later use
    login(address);
    setCurrentStep(SignupStep.EmailVerification);
  };

  // Handle wallet connection skipped
  const handleWalletSkipped = () => {
    setCurrentStep(SignupStep.EmailVerification);
  };

  // Handle email verification success
  const handleEmailVerified = () => {
    setCurrentStep(SignupStep.Success);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Render different steps
  const renderStep = () => {
    switch (currentStep) {
      case SignupStep.AccountInfo:
        return (
          <form onSubmit={handleCreateAccount} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* First Name */}
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      shakingFields.includes("firstName") ? "animate-[shake_0.5s_ease-in-out]" : ""
                    }`}
                    placeholder="Enter your first name"
                  />
                </div>
                {formErrors.firstName && (
                  <p className="text-xs text-destructive">{formErrors.firstName}</p>
                )}
              </div>
              
              {/* Last Name */}
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      shakingFields.includes("lastName") ? "animate-[shake_0.5s_ease-in-out]" : ""
                    }`}
                    placeholder="Enter your last name"
                  />
                </div>
                {formErrors.lastName && (
                  <p className="text-xs text-destructive">{formErrors.lastName}</p>
                )}
              </div>
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    shakingFields.includes("email") ? "animate-[shake_0.5s_ease-in-out]" : ""
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {formErrors.email && (
                <p className="text-xs text-destructive">{formErrors.email}</p>
              )}
            </div>
            
            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    shakingFields.includes("password") ? "animate-[shake_0.5s_ease-in-out]" : ""
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5 text-muted-foreground hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                  ) : (
                    <svg className="h-5 w-5 text-muted-foreground hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-xs text-destructive">{formErrors.password}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Min. 8 characters with uppercase, lowercase, number and special character
              </p>
            </div>
            
            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    shakingFields.includes("confirmPassword") ? "animate-[shake_0.5s_ease-in-out]" : ""
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5 text-muted-foreground hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                  ) : (
                    <svg className="h-5 w-5 text-muted-foreground hover:text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="text-xs text-destructive">{formErrors.confirmPassword}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-accent hover:bg-accent/90 transition-all rounded-md h-11 group"
              disabled={loading}
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </Button>
          </form>
        );
        
      case SignupStep.WalletConnection:
        return (
          <div className="space-y-4">
            <WalletConnection 
              onSuccess={handleWalletConnected} 
              onSkip={handleWalletSkipped} 
            />
            
            <div className="flex items-center justify-center pt-4">
              <Button
                variant="ghost"
                className="flex items-center text-muted-foreground"
                onClick={() => setCurrentStep(SignupStep.AccountInfo)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </div>
          </div>
        );
        
      case SignupStep.EmailVerification:
        return (
          <div className="space-y-4">
            <EmailVerification 
              email={email} 
              onSuccess={handleEmailVerified} 
            />
            
            <div className="flex items-center justify-center pt-4">
              <Button
                variant="ghost"
                className="flex items-center text-muted-foreground"
                onClick={() => setCurrentStep(SignupStep.WalletConnection)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </div>
          </div>
        );
        
      case SignupStep.Success:
        return <SignupSuccess countdown={countdown} />;
        
      default:
        return null;
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg shadow-lg p-8 border border-border animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Create Account</h1>
              <p className="text-muted-foreground">Join EstateToken to start investing in real estate</p>
            </div>
            
            {/* Progress indicators */}
            <div className="flex items-center justify-center mb-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="flex items-center">
                  <div className={`rounded-full w-3 h-3 ${
                    index <= currentStep ? "bg-accent" : "bg-muted-foreground/30"
                  }`} />
                  {index < 3 && (
                    <div className={`w-10 h-1 ${
                      index < currentStep ? "bg-accent" : "bg-muted-foreground/30"
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            {/* Current step content */}
            {renderStep()}
            
            {/* Login link (only show on first step) */}
            {currentStep === SignupStep.AccountInfo && (
              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="font-semibold text-accent hover:underline">
                    Login <ArrowRight className="inline h-3 w-3" />
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Signup;
