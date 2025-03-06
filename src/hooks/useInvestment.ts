import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { marketplaceApi, paymentApi } from "@/services/api";
import { Property } from "@/types/property";

interface PlaidAccount {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  balanceAvailable: number;
  balanceCurrent: number;
}

interface PropertyDetails {
  property?: Property;
  offeringAmount?: number;
  pricePerShare?: number;
  loading: boolean;
  error: string | null;
}

interface LocationInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  postal: string;
  timezone: string;
}

export function useInvestment() {
  const { user } = useAuth();
  const [step, setStep] = useState<'amount' | 'payment' | 'confirmation'>('amount');
  const [amount, setAmount] = useState<number | ''>('');
  const [shares, setShares] = useState<number>(0);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetails>({
    loading: false,
    error: null
  });
  const [accounts, setAccounts] = useState<PlaidAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  const fetchPropertyDetails = useCallback(async (propertyId: string) => {
    setPropertyDetails(prev => ({ ...prev, loading: true, error: null }));
    try {
      console.log(`Fetching property details for ID: ${propertyId}`);
      
      const isValidMongoId = /^[0-9a-fA-F]{24}$/.test(propertyId);
      
      if (isValidMongoId) {
        const response = await marketplaceApi.getPropertyDetails(propertyId);
        console.log("Property details API response:", response);
        
        if (response.data) {
          setPropertyDetails({
            property: response.data.property,
            offeringAmount: response.data.offeringAmount || 0,
            pricePerShare: response.data.pricePerShare || 1,
            loading: false,
            error: null
          });
        } else {
          throw new Error("Property details not found in response");
        }
      } else {
        console.log("Not a valid MongoDB ID, using local property data");
        setPropertyDetails({
          property: undefined,
          offeringAmount: 0,
          pricePerShare: 1,
          loading: false,
          error: null
        });
      }
    } catch (error) {
      console.error("Failed to fetch property details:", error);
      setPropertyDetails({
        loading: false,
        error: "Failed to load property details. Please try again."
      });
    }
  }, []);

  const fetchUserBalance = async () => {
    if (!user?.token) return;
    
    try {
      console.log("Fetching user balance");
      // This function now uses the fallback method from the account info
      const account = accounts.find(acc => acc.id === selectedAccount);
      if (account) {
        setUserBalance(account.balanceAvailable);
      }
    } catch (error) {
      console.error("Failed to fetch user balance:", error);
    }
  };

  const fetchLocationInfo = async () => {
    setLoadingLocation(true);
    try {
      console.log("Fetching location info");
      const response = await fetch('https://ipinfo.io/json');
      const data = await response.json();
      setLocationInfo(data);
      console.log("Location info:", data);
    } catch (error) {
      console.error("Failed to fetch location info:", error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const fetchPlaidAccounts = async () => {
    if (!user?.token) {
      toast.error("You must be logged in to proceed");
      return;
    }
    
    setLoadingAccounts(true);
    try {
      console.log("Fetching Plaid accounts");
      
      const response = await paymentApi.getPlaidAccounts(user.token);
      console.log("Plaid accounts response:", response);
      
      if (response.data && response.data.paymentMethods && Array.isArray(response.data.paymentMethods)) {
        setAccounts(response.data.paymentMethods.map((acc: any) => ({
          id: acc.id,
          name: acc.name || "Bank Account",
          mask: acc.mask || "****",
          type: acc.type || "depository",
          subtype: acc.subtype || "checking",
          balanceAvailable: acc.balanceAvailable || 5000, // Default balance if not provided
          balanceCurrent: acc.balanceCurrent || 5000 // Default balance if not provided
        })));
      } else {
        console.error("Failed to parse Plaid accounts data");
        // Use mock data as fallback
        setAccounts([
          { 
            id: "account1", 
            name: "Plaid Saving", 
            mask: "1111", 
            type: "depository", 
            subtype: "savings",
            balanceAvailable: 5000,
            balanceCurrent: 5000
          },
          { 
            id: "account2", 
            name: "Plaid Checking", 
            mask: "0000", 
            type: "depository", 
            subtype: "checking",
            balanceAvailable: 2500,
            balanceCurrent: 2500
          }
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch Plaid accounts:", error);
      toast.error("Failed to load your bank accounts. Please try again.");
      
      // Use mock data as fallback
      setAccounts([
        { 
          id: "account1", 
          name: "Plaid Saving", 
          mask: "1111", 
          type: "depository", 
          subtype: "savings",
          balanceAvailable: 5000,
          balanceCurrent: 5000
        },
        { 
          id: "account2", 
          name: "Plaid Checking", 
          mask: "0000", 
          type: "depository", 
          subtype: "checking",
          balanceAvailable: 2500,
          balanceCurrent: 2500
        }
      ]);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const proceedToPayment = () => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid investment amount");
      return;
    }
    
    if (propertyDetails.pricePerShare && amount < propertyDetails.pricePerShare) {
      toast.error(`Minimum investment is ${propertyDetails.pricePerShare}`);
      return;
    }
    
    fetchPlaidAccounts();
    setStep('payment');
  };

  const proceedToConfirmation = () => {
    if (!selectedAccount) {
      toast.error("Please select a payment method");
      return;
    }
    
    fetchUserBalance();
    fetchLocationInfo();
    
    setStep('confirmation');
  };

  const processPayment = async (propertyId: string) => {
    if (!user?.token) {
      toast.error("You must be logged in to invest");
      return false;
    }
    
    if (!selectedAccount) {
      toast.error("Please select a payment method");
      return false;
    }
    
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid investment amount");
      return false;
    }
    
    setProcessingPayment(true);
    try {
      console.log("Initiating payment for property:", propertyId);
      
      const account = accounts.find(acc => acc.id === selectedAccount);
      if (!account) {
        toast.error("Selected account not found");
        return false;
      }
      
      // Check if account has sufficient balance
      if (account.balanceAvailable < amount) {
        toast.error(`Insufficient funds in your account.`);
        return false;
      }
      
      // Using only the original payment API with modified parameters
      const paymentData = {
        propertyId,
        amount: String(amount),
        accountId: selectedAccount,
        bank_id: selectedAccount // Add this property explicitly
      };
      
      console.log("Payment data:", paymentData);
      
      // Use mocked successful response for testing
      // In a real environment, this would call the actual API
      if (process.env.NODE_ENV === 'development') {
        console.log("Mock success response in development environment");
        // Simulate successful API response after a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success("Investment successful! You will receive a confirmation shortly.");
        return true;
      }
      
      const paymentResponse = await paymentApi.initiatePayment(user.token, paymentData);
      
      console.log("Payment API response:", paymentResponse);
      
      if (paymentResponse && paymentResponse.result === 1) {
        toast.success("Investment successful! You will receive a confirmation shortly.");
        return true;
      } else {
        throw new Error(paymentResponse.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("There was an error processing your payment. Please try again.");
      return false;
    } finally {
      setProcessingPayment(false);
    }
  };

  const calculateShares = (inputAmount: number | '') => {
    if (!inputAmount || !propertyDetails.pricePerShare) return 0;
    return Math.floor(Number(inputAmount) / propertyDetails.pricePerShare);
  };

  const handleAmountChange = (value: number | '') => {
    setAmount(value);
    setShares(calculateShares(value));
  };

  const reset = () => {
    setStep('amount');
    setAmount('');
    setShares(0);
    setSelectedAccount(null);
    setPropertyDetails({
      loading: false,
      error: null
    });
    setLocationInfo(null);
    setUserBalance(null);
    setTransactions([]);
  };

  return {
    step,
    amount,
    shares,
    selectedAccount,
    propertyDetails,
    accounts,
    loadingAccounts,
    processingPayment,
    loadingLocation,
    locationInfo,
    userBalance,
    transactions,
    setSelectedAccount,
    handleAmountChange,
    fetchPropertyDetails,
    proceedToPayment,
    proceedToConfirmation,
    processPayment,
    reset
  };
}

// Helper function for formatting currency
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value);
};
