
import { useState } from "react";
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

export function useInvestment() {
  const { user } = useAuth();
  const [step, setStep] = useState<'amount' | 'payment'>('amount');
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

  const fetchPropertyDetails = async (propertyId: string) => {
    setPropertyDetails(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await marketplaceApi.getPropertyDetails(propertyId);
      if (response.data) {
        setPropertyDetails({
          property: response.data.property,
          offeringAmount: response.data.offeringAmount || 0,
          pricePerShare: response.data.pricePerShare || 1,
          loading: false,
          error: null
        });
      } else {
        setPropertyDetails({
          loading: false,
          error: "Unable to load property details"
        });
      }
    } catch (error) {
      console.error("Failed to fetch property details:", error);
      setPropertyDetails({
        loading: false,
        error: "Failed to load property details. Please try again."
      });
    }
  };

  const fetchPlaidAccounts = async () => {
    if (!user?.token) {
      toast.error("You must be logged in to proceed");
      return;
    }
    
    setLoadingAccounts(true);
    try {
      const response = await paymentApi.getPlaidAccounts(user.token);
      if (response.data && Array.isArray(response.data)) {
        setAccounts(response.data.map((acc: any) => ({
          id: acc.account_id || acc.id,
          name: acc.name,
          mask: acc.mask,
          type: acc.type,
          subtype: acc.subtype,
          balanceAvailable: acc.balances?.available || 0,
          balanceCurrent: acc.balances?.current || 0
        })));
      } else {
        // Fallback sample data for development
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
      
      // Set fallback data for development
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

  const processPayment = async (propertyId: string) => {
    if (!user?.token) {
      toast.error("You must be logged in to invest");
      return;
    }
    
    if (!selectedAccount) {
      toast.error("Please select a payment method");
      return;
    }
    
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid investment amount");
      return;
    }
    
    setProcessingPayment(true);
    try {
      const response = await paymentApi.initiatePayment(user.token, {
        propertyId,
        amount: Number(amount),
        accountId: selectedAccount
      });
      
      if (response.result === 1) {
        toast.success("Investment successful! You will receive a confirmation shortly.");
        return true;
      } else {
        toast.error(response.message || "Failed to process your investment");
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
    setSelectedAccount,
    handleAmountChange,
    fetchPropertyDetails,
    proceedToPayment,
    processPayment,
    reset
  };
}
