
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

interface User {
  walletAddress: string | null;
  profileImage: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (walletAddress: string) => void;
  logout: () => void;
}

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: () => {},
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
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
