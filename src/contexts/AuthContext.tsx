
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  walletAddress: string | null;
  profileImage: string;
  email?: string;
  token?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (walletAddress: string) => void;
  emailLogin: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<boolean>;
  verifyEmail: (email: string, otp: number) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (profileData: ProfileUpdateData) => Promise<boolean>;
}

interface ProfileUpdateData {
  dob?: string; // Made optional
  countryCode: string;
  mobileNumber: number;
  country: string;
  state: string;
  city: string;
  zipCode: number;
  address1: string;
  stateCode: string;
}

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: () => {},
  emailLogin: async () => false,
  signup: async () => false,
  verifyEmail: async () => false,
  logout: () => {},
  updateUserProfile: async () => false,
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('estateToken_user');
    console.log("Checking for stored user data:", storedUser ? "Found" : "Not found");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log("Parsed stored user data:", { ...parsedUser, token: parsedUser.token ? `${parsedUser.token.substring(0, 10)}...` : null });
        
        // Ensure the token exists and is not null or undefined
        if (parsedUser.token) {
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log("User authenticated with token:", parsedUser.token.substring(0, 10) + "...");
        } else {
          console.warn("Found user data but token is missing or invalid");
          // Consider if you want to clear invalid data
          // localStorage.removeItem('estateToken_user');
        }
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('estateToken_user');
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          logout();
          toast.error("Wallet disconnected. You've been logged out.");
        } else if (user && accounts[0] !== user.walletAddress) {
          logout();
          toast.error("Wallet account changed. Please log in again.");
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [user]);

  const login = (walletAddress: string) => {
    const newUser = {
      walletAddress,
      profileImage: '/placeholder.svg',
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('estateToken_user', JSON.stringify(newUser));
  };

  const emailLogin = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    try {
      console.log("Attempting email login for:", email);
      const response = await fetch('https://dev-user-api.investech.global/api/v2/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log("Login response:", { ...data, token: data.token ? `${data.token.substring(0, 10)}...` : null });
      
      // Extract token from the correct location in the response
      const token = data.data?.token || data.token || data.accessToken;
      
      if (!token) {
        console.error("No token found in login response");
        toast.error("Authentication error: No token received");
        return false;
      }
      
      const newUser = {
        email,
        profileImage: data.data?.profileImage || '/placeholder.svg',
        walletAddress: data.data?.walletAddress || null,
        token: token,
        firstName: data.data?.firstName,
        lastName: data.data?.lastName,
      };

      console.log("Setting user data after login:", { ...newUser, token: newUser.token ? `${newUser.token.substring(0, 10)}...` : null });
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('estateToken_user', JSON.stringify(newUser));
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to login. Please try again.');
      return false;
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string): Promise<boolean> => {
    try {
      const response = await fetch('https://dev-user-api.investech.global/api/v2/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Signup failed');
      }

      const data = await response.json();
      
      toast.success(data.msg || 'Account created successfully! Please log in.');
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create account. Please try again.');
      return false;
    }
  };

  const verifyEmail = async (email: string, otp: number): Promise<boolean> => {
    try {
      const response = await fetch('https://dev-user-api.investech.global/api/v2/user/emailVerification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Email verification failed');
      }

      const data = await response.json();
      toast.success(data.msg || 'Email verified successfully!');
      return true;
    } catch (error) {
      console.error('Email verification error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to verify email. Please try again.');
      return false;
    }
  };

  const updateUserProfile = async (profileData: ProfileUpdateData): Promise<boolean> => {
    if (!user?.token) {
      toast.error("You must be logged in to update your profile");
      return false;
    }

    try {
      const response = await fetch('https://dev-user-api.investech.global/api/v2/user/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile. Please try again.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('estateToken_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        emailLogin,
        signup,
        verifyEmail,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
