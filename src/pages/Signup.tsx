
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Mail, Lock, ArrowRight, Calendar, MapPin, Phone, User } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import WalletConnectModal from "@/components/auth/WalletConnectModal";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";

const Signup = () => {
  const navigate = useNavigate();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Personal details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shakingFields, setShakingFields] = useState<string[]>([]);

  const validateField = (field: string, value: string): string => {
    switch (field) {
      case "firstName":
      case "lastName":
        return value.trim() ? "" : "This field is required";
      case "dob":
        const dobDate = new Date(value);
        const today = new Date();
        const minAge = new Date();
        minAge.setFullYear(today.getFullYear() - 18);
        return !value ? "Date of birth is required" :
               dobDate > minAge ? "You must be at least 18 years old" : "";
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !value ? "Email is required" :
               !emailRegex.test(value) ? "Please enter a valid email address" : "";
      case "address":
        return value.trim() ? "" : "Address is required";
      case "zipCode":
        const zipRegex = /^\d{5}(-\d{4})?$/;
        return !value ? "Zip code is required" :
               !zipRegex.test(value) ? "Please enter a valid zip code" : "";
      case "phoneNumber":
        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        return !value ? "Phone number is required" :
               !phoneRegex.test(value) ? "Please enter a valid phone number" : "";
      case "username":
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return !value ? "Username is required" :
               !usernameRegex.test(value) ? "Username must be 3-20 characters with only letters, numbers, and underscores" : "";
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

  const validateForm = (): boolean => {
    const fields = {
      firstName,
      lastName, 
      dob,
      email,
      address,
      zipCode,
      phoneNumber,
      username,
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

  const checkExistingEmail = async (email: string): Promise<boolean> => {
    // Simulate API call to check if email exists
    // This would be replaced with a real API call in production
    const registeredEmails = ["user@example.com"];
    return registeredEmails.includes(email);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Check if email already exists
      const emailExists = await checkExistingEmail(email);
      if (emailExists) {
        setFormErrors(prev => ({ ...prev, email: "Email already registered" }));
        setShakingFields(["email"]);
        setTimeout(() => setShakingFields([]), 500);
        toast.error("Email already registered. Please use a different email or login.");
        setLoading(false);
        return;
      }
      
      // If validation passes and email is available, show wallet connect modal
      setShowWalletModal(true);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWalletConnected = () => {
    // This is called after wallet is connected and email is verified
    // In a real app, we would make the actual API call to register the user here
    localStorage.setItem("userRegistered", email);
    
    toast.success("Account created successfully!");
    
    // Redirect to login after a short delay
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen flex items-center justify-center px-4 py-24">
        <div className="w-full max-w-2xl">
          <div className="bg-card rounded-lg shadow-lg p-8 border border-border animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Create Account</h1>
              <p className="text-muted-foreground">Join EstateToken to start investing in real estate</p>
            </div>
            
            <form onSubmit={handleSignup} className="space-y-5">
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
                
                {/* Date of Birth */}
                <div className="space-y-2">
                  <label htmlFor="dob" className="block text-sm font-medium">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="dob"
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        shakingFields.includes("dob") ? "animate-[shake_0.5s_ease-in-out]" : ""
                      }`}
                    />
                  </div>
                  {formErrors.dob && (
                    <p className="text-xs text-destructive">{formErrors.dob}</p>
                  )}
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
                
                {/* Address */}
                <div className="space-y-2">
                  <label htmlFor="address" className="block text-sm font-medium">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="address"
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        shakingFields.includes("address") ? "animate-[shake_0.5s_ease-in-out]" : ""
                      }`}
                      placeholder="Enter your address"
                    />
                  </div>
                  {formErrors.address && (
                    <p className="text-xs text-destructive">{formErrors.address}</p>
                  )}
                </div>
                
                {/* Zip Code */}
                <div className="space-y-2">
                  <label htmlFor="zipCode" className="block text-sm font-medium">
                    Zip Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="zipCode"
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        shakingFields.includes("zipCode") ? "animate-[shake_0.5s_ease-in-out]" : ""
                      }`}
                      placeholder="Enter your zip code"
                    />
                  </div>
                  {formErrors.zipCode && (
                    <p className="text-xs text-destructive">{formErrors.zipCode}</p>
                  )}
                </div>
                
                {/* Phone Number */}
                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        shakingFields.includes("phoneNumber") ? "animate-[shake_0.5s_ease-in-out]" : ""
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  {formErrors.phoneNumber && (
                    <p className="text-xs text-destructive">{formErrors.phoneNumber}</p>
                  )}
                </div>
                
                {/* Username */}
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        shakingFields.includes("username") ? "animate-[shake_0.5s_ease-in-out]" : ""
                      }`}
                      placeholder="Choose a username"
                    />
                  </div>
                  {formErrors.username && (
                    <p className="text-xs text-destructive">{formErrors.username}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                        <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground" />
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
                        <EyeOff className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                      ) : (
                        <Eye className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                  </div>
                  {formErrors.confirmPassword && (
                    <p className="text-xs text-destructive">{formErrors.confirmPassword}</p>
                  )}
                </div>
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
                    Create Account <UserPlus className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </Button>
            </form>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <SocialAuthButtons onSuccess={() => setShowWalletModal(true)} />
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-accent hover:underline">
                  Login <ArrowRight className="inline h-3 w-3" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <WalletConnectModal 
        isOpen={showWalletModal} 
        onClose={() => setShowWalletModal(false)} 
        onConnect={handleWalletConnected}
      />
      
      <Footer />
    </>
  );
};

export default Signup;
