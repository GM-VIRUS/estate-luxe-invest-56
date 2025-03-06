
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
      // Use the updated getUserBalance endpoint
      const response = await paymentApi.getUserBalance(user.token);
      console.log("User balance:", response);
      
      if (response.data && typeof response.data.balance === 'number') {
        setUserBalance(response.data.balance);
      }
    } catch (error) {
      console.error("Failed to fetch user balance:", error);
    }
  };

  const fetchTransactionHistory = async () => {
    if (!user?.token) return;
    
    try {
      console.log("Fetching transaction history");
      // Use the new getTransactions endpoint
      const response = await paymentApi.getTransactions(user.token);
      console.log("Transaction history:", response);
      
      if (response.data && Array.isArray(response.data.transactions)) {
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error("Failed to fetch transaction history:", error);
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
      console.log("Fetching bank accounts");
      // Try the new getBankAccounts endpoint first
      const response = await paymentApi.getBankAccounts(user.token);
      console.log("Bank accounts response:", response);
      
      if (response.data && Array.isArray(response.data.accounts)) {
        setAccounts(response.data.accounts.map((acc: any) => ({
          id: acc.id,
          name: acc.name || acc.account_name || "Bank Account",
          mask: acc.last4 || acc.mask || "****",
          type: acc.type || "depository",
          subtype: acc.subtype || "checking",
          balanceAvailable: acc.available_balance || acc.balanceAvailable || 0,
          balanceCurrent: acc.current_balance || acc.balanceCurrent || 0
        })));
      } else {
        // Fallback to the original API as backup
        console.log("Bank accounts API response not structured as expected, trying Plaid accounts API");
        return await fallbackFetchPlaidAccounts();
      }
    } catch (error) {
      console.error("Failed to fetch bank accounts:", error);
      
      // Try fallback to original Plaid accounts API
      try {
        await fallbackFetchPlaidAccounts();
      } catch (backupError) {
        console.error("Both bank account APIs failed:", backupError);
        toast.error("Failed to load your bank accounts. Please try again.");
        
        // Use mock data as last resort
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
    } finally {
      setLoadingAccounts(false);
    }
  };

  const fallbackFetchPlaidAccounts = async () => {
    if (!user?.token) return;
    
    console.log("Falling back to original Plaid accounts API");
    const response = await paymentApi.getPlaidAccounts(user.token);
    
    if (response.data && response.data.paymentMethods && Array.isArray(response.data.paymentMethods)) {
      setAccounts(response.data.paymentMethods.map((acc: any) => ({
        id: acc.id,
        name: acc.name,
        mask: acc.mask,
        type: acc.type || "depository",
        subtype: acc.subtype || "checking",
        balanceAvailable: acc.balanceAvailable || 0,
        balanceCurrent: acc.balanceCurrent || 0
      })));
    } else {
      throw new Error("Failed to parse Plaid accounts data");
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
    fetchTransactionHistory();
    
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
      
      let paymentSuccessful = false;
      
      // Try the new createTransfer endpoint first
      try {
        console.log("Trying create-transfer API...");
        
        const transferData = {
          amount: String(amount),
          source_account_id: selectedAccount,
          description: `Investment in property ${propertyId}`
        };
        
        const transferResponse = await paymentApi.createTransfer(user.token, transferData);
        
        console.log("Transfer API response:", transferResponse);
        
        if (transferResponse && (transferResponse.result === 1 || transferResponse.data?.success)) {
          paymentSuccessful = true;
          toast.success("Investment successful! You will receive a confirmation shortly.");
        } else {
          throw new Error(transferResponse.message || "Transfer failed");
        }
      } catch (transferError) {
        console.error("Transfer API failed, trying checkout API:", transferError);
        
        try {
          console.log("Trying checkout API...");
          
          const checkoutResponse = await paymentApi.initiateCheckout(user.token, {
            propertyId,
            amount: String(amount),
            account_id: selectedAccount
          });
          
          console.log("Checkout API response:", checkoutResponse);
          
          if (checkoutResponse && checkoutResponse.result === 1) {
            paymentSuccessful = true;
            toast.success("Investment successful! You will receive a confirmation shortly.");
          } else {
            throw new Error(checkoutResponse.message || "Checkout failed");
          }
        } catch (checkoutError) {
          console.error("Checkout API failed, trying payment API:", checkoutError);
          
          // Try original payment API as last resort
          try {
            console.log("Trying payment API...");
            
            const paymentData = {
              propertyId,
              amount: String(amount),
              accountId: selectedAccount,
              bank_id: selectedAccount
            };
            
            const paymentResponse = await paymentApi.initiatePayment(user.token, paymentData);
            
            console.log("Payment API response:", paymentResponse);
            
            if (paymentResponse && paymentResponse.result === 1) {
              paymentSuccessful = true;
              toast.success("Investment successful! You will receive a confirmation shortly.");
            } else {
              throw new Error(paymentResponse.message || "Payment failed");
            }
          } catch (paymentError) {
            console.error("All payment APIs failed:", paymentError);
            toast.error("There was an error processing your payment. Please try again later.");
            return false;
          }
        }
      }
      
      if (paymentSuccessful) {
        await fetchTransactionHistory();
        await fetchUserBalance();
        return true;
      } else {
        return false;
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
