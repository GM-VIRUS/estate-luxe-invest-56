
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  walletAddress: string | null;
  profileImage: string;
  email?: string;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (walletAddress: string) => void;
  emailLogin: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
}

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: () => {},
  emailLogin: async () => false,
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('estateToken_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('estateToken_user');
      }
    }
  }, []);

  // Listen for Metamask account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          logout();
          toast.error("Wallet disconnected. You've been logged out.");
        } else if (user && accounts[0] !== user.walletAddress) {
          // User switched to a different account
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
      
      // Create a user object with the response data
      const newUser = {
        email,
        profileImage: '/placeholder.svg',
        walletAddress: null,
        token: data.token || data.accessToken,
      };

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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
