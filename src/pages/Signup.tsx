
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Mail, Lock, Calendar, Phone, User, MapPin, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import WalletConnectModal from "@/components/auth/WalletConnectModal";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";

type FormField = {
  name: string;
  value: string;
  error: string;
  required: boolean;
};

const Signup = () => {
  const navigate = useNavigate();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shakingFields, setShakingFields] = useState<string[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [formData, setFormData] = useState<{[key: string]: FormField}>({
    firstName: { name: "firstName", value: "", error: "", required: true },
    lastName: { name: "lastName", value: "", error: "", required: true },
    username: { name: "username", value: "", error: "", required: true },
    email: { name: "email", value: "", error: "", required: true },
    phoneNumber: { name: "phoneNumber", value: "", error: "", required: true },
    address: { name: "address", value: "", error: "", required: true },
    zipCode: { name: "zipCode", value: "", error: "", required: true },
    password: { name: "password", value: "", error: "", required: true },
    confirmPassword: { name: "confirmPassword", value: "", error: "", required: true },
  });

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        value,
        error: ""
      }
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const shakingFieldsList: string[] = [];
    const updatedFormData = { ...formData };

    // Validate required fields
    Object.keys(formData).forEach(fieldName => {
      const field = formData[fieldName];
      if (field.required && !field.value.trim()) {
        updatedFormData[fieldName].error = `${fieldName.replace(/([A-Z])/g, ' $1').trim()} is required`;
        isValid = false;
        shakingFieldsList.push(fieldName);
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.value && !emailRegex.test(formData.email.value)) {
      updatedFormData.email.error = "Please enter a valid email address";
      isValid = false;
      shakingFieldsList.push("email");
    }

    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (formData.phoneNumber.value && !phoneRegex.test(formData.phoneNumber.value)) {
      updatedFormData.phoneNumber.error = "Please enter a valid 10-digit phone number";
      isValid = false;
      shakingFieldsList.push("phoneNumber");
    }

    // Zip code validation
    const zipCodeRegex = /^\d{5}(-\d{4})?$/;
    if (formData.zipCode.value && !zipCodeRegex.test(formData.zipCode.value)) {
      updatedFormData.zipCode.error = "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)";
      isValid = false;
      shakingFieldsList.push("zipCode");
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (formData.username.value && !usernameRegex.test(formData.username.value)) {
      updatedFormData.username.error = "Username must be 3-20 characters and contain only letters, numbers, and underscores";
      isValid = false;
      shakingFieldsList.push("username");
    }

    // Password validation
    if (formData.password.value) {
      const passwordStrength = validatePasswordStrength(formData.password.value);
      if (passwordStrength !== "strong") {
        updatedFormData.password.error = "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character";
        isValid = false;
        shakingFieldsList.push("password");
      }
    }

    // Confirm password validation
    if (formData.password.value !== formData.confirmPassword.value) {
      updatedFormData.confirmPassword.error = "Passwords do not match";
      isValid = false;
      shakingFieldsList.push("confirmPassword");
    }

    // Date of birth validation
    if (!date) {
      isValid = false;
      shakingFieldsList.push("dob");
    }

    setFormData(updatedFormData);
    setShakingFields(shakingFieldsList);
    setTimeout(() => setShakingFields([]), 500);

    return isValid;
  };

  const validatePasswordStrength = (password: string) => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    const isLongEnough = password.length >= 8;

    if (isLongEnough && hasUppercase && hasLowercase && hasNumber && hasSpecialChar) {
      return "strong";
    } else if (isLongEnough && (hasUppercase || hasLowercase) && (hasNumber || hasSpecialChar)) {
      return "medium";
    } else {
      return "weak";
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    
    setLoading(true);
    
    // Simulate sign up
    setTimeout(() => {
      // Store registered email for login page to use
      localStorage.setItem("userRegistered", formData.email.value);
      
      setLoading(false);
      setShowWalletModal(true);
    }, 1500);
  };

  const handleWalletConnected = () => {
    // After wallet is connected, show success and redirect
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
      
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl">
          <div className="bg-card rounded-lg shadow-lg p-8 border border-border animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
              <p className="text-muted-foreground">Join our platform to start investing in real estate</p>
            </div>
            
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Personal Information */}
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
                      value={formData.firstName.value}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        shakingFields.includes("firstName") ? "animate-[shake_0.5s_ease-in-out]" : ""
                      }`}
                      placeholder="John"
                    />
                  </div>
                  {formData.firstName.error && <p className="text-destructive text-sm mt-1">{formData.firstName.error}</p>}
                </div>

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
                      value={formData.lastName.value}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        shakingFields.includes("lastName") ? "animate-[shake_0.5s_ease-in-out]" : ""
                      }`}
                      placeholder="Doe"
                    />
                  </div>
                  {formData.lastName.error && <p className="text-destructive text-sm mt-1">{formData.lastName.error}</p>}
                </div>

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
                      value={formData.username.value}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        shakingFields.includes("username") ? "animate-[shake_0.5s_ease-in-out]" : ""
                      }`}
                      placeholder="johndoe123"
                    />
                  </div>
                  {formData.username.error && <p className="text-destructive text-sm mt-1">{formData.username.error}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="dob" className="block text-sm font-medium">
                    Date of Birth
                  </label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className={`relative w-full h-11 ${shakingFields.includes("dob") ? "animate-[shake_0.5s_ease-in-out]" : ""}`}>
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <Button
                          variant="outline"
                          className={`w-full h-11 pl-10 justify-start text-left font-normal ${!date ? "text-muted-foreground" : ""}`}
                        >
                          {date ? format(date, "PPP") : "Select your date of birth"}
                        </Button>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Contact Information */}
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
                      value={formData.email.value}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        shakingFields.includes("email") ? "animate-[shake_0.5s_ease-in-out]" : ""
                      }`}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  {formData.email.error && <p className="text-destructive text-sm mt-1">{formData.email.error}</p>}
                </div>

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
                      value={formData.phoneNumber.value}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        shakingFields.includes("phoneNumber") ? "animate-[shake_0.5s_ease-in-out]" : ""
                      }`}
                      placeholder="1234567890"
                    />
                  </div>
                  {formData.phoneNumber.error && <p className="text-destructive text-sm mt-1">{formData.phoneNumber.error}</p>}
                </div>

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
                      value={formData.address.value}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        shakingFields.includes("address") ? "animate-[shake_0.5s_ease-in-out]" : ""
                      }`}
                      placeholder="123 Main St, Apt 4B"
                    />
                  </div>
                  {formData.address.error && <p className="text-destructive text-sm mt-1">{formData.address.error}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="zipCode" className="block text-sm font-medium">
                    ZIP Code
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <input
                      id="zipCode"
                      type="text"
                      value={formData.zipCode.value}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        shakingFields.includes("zipCode") ? "animate-[shake_0.5s_ease-in-out]" : ""
                      }`}
                      placeholder="12345"
                    />
                  </div>
                  {formData.zipCode.error && <p className="text-destructive text-sm mt-1">{formData.zipCode.error}</p>}
                </div>

                {/* Security */}
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
                      value={formData.password.value}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        shakingFields.includes("password") ? "animate-[shake_0.5s_ease-in-out]" : ""
                      }`}
                      placeholder="••••••••"
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
                  {formData.password.error && <p className="text-destructive text-sm mt-1">{formData.password.error}</p>}
                </div>

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
                      value={formData.confirmPassword.value}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`pl-10 w-full h-11 rounded-md border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                        shakingFields.includes("confirmPassword") ? "animate-[shake_0.5s_ease-in-out]" : ""
                      }`}
                      placeholder="••••••••"
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
                  {formData.confirmPassword.error && <p className="text-destructive text-sm mt-1">{formData.confirmPassword.error}</p>}
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
                  Log in <ArrowRight className="inline h-3 w-3" />
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
