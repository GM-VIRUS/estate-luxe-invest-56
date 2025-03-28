
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useInvestment } from "@/hooks/useInvestment";
import { Property } from "@/types/property";
import { InvestAmount } from "./InvestAmount";
import { PaymentMethod } from "./PaymentMethod";
import { Skeleton } from "@/components/ui/skeleton";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { OrderConfirmation } from "./OrderConfirmation";
import { toast } from "sonner";

interface InvestModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export function InvestModal({ property, isOpen, onClose }: InvestModalProps) {
  const {
    step,
    setStep,
    amount,
    shares,
    selectedAccount,
    propertyDetails,
    accounts,
    loadingAccounts,
    processingPayment,
    loadingLocation,
    locationInfo,
    setSelectedAccount,
    handleAmountChange,
    fetchPropertyDetails,
    proceedToPayment,
    proceedToConfirmation,
    processPayment,
    reset
  } = useInvestment();

  const [isInitialized, setIsInitialized] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Initialize data when modal opens
  useEffect(() => {
    if (isOpen && !isInitialized) {
      const apiPropertyId = property.id;
      console.log("Fetching property details with ID:", apiPropertyId);
      fetchPropertyDetails(apiPropertyId);
      setIsInitialized(true);
    }
  }, [isOpen, property, isInitialized, fetchPropertyDetails]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        reset();
        setIsInitialized(false);
        setPaymentError(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, reset]);

  const handleSubmitPayment = async () => {
    setPaymentError(null);
    
    if (!selectedAccount) {
      setPaymentError("Please select a payment method");
      toast.error("Please select a payment method");
      return;
    }
    
    const apiPropertyId = property.id;
    
    try {
      console.log("Processing payment for property:", apiPropertyId);
      console.log("Selected account:", selectedAccount);
      console.log("Amount:", amount);
      
      // Mock success in development environment for testing
      if (process.env.NODE_ENV === 'development') {
        toast.success("Investment successful!");
        setTimeout(() => onClose(), 1500);
        return;
      }
      
      const success = await processPayment(apiPropertyId);
      if (success) {
        toast.success("Investment successful!");
        setTimeout(() => onClose(), 1500);
      } else {
        setPaymentError("Payment processing failed. Please try again.");
        toast.error("Payment processing failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      let errorMessage = "There was an error processing your payment. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      setPaymentError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleContinueToConfirmation = () => {
    if (!selectedAccount) {
      toast.error("Please select a payment method");
      return;
    }
    
    proceedToConfirmation();
  };

  const handleGoBackToPayment = () => {
    setStep('payment');
  };

  // Render the appropriate content based on the current step
  const renderContent = () => {
    if (step === 'amount') {
      return (
        <InvestAmount
          property={property}
          details={propertyDetails}
          amount={amount}
          shares={shares}
          onAmountChange={handleAmountChange}
          onProceed={proceedToPayment}
        />
      );
    } 
    
    if (step === 'payment') {
      return (
        <PaymentMethod
          accounts={accounts}
          selectedAccount={selectedAccount}
          loading={loadingAccounts}
          processing={processingPayment}
          onSelectAccount={setSelectedAccount}
          onSubmit={handleSubmitPayment}
          onContinue={handleContinueToConfirmation}
        />
      );
    }
    
    // Default to confirmation step
    return (
      <OrderConfirmation
        property={property}
        amount={Number(amount)}
        selectedAccount={accounts.find(acc => acc.id === selectedAccount)}
        processing={processingPayment}
        onConfirm={handleSubmitPayment}
        onGoBack={handleGoBackToPayment}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <VisuallyHidden asChild>
          <DialogTitle>Invest in {property.title}</DialogTitle>
        </VisuallyHidden>
        
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 bg-white/80 hover:bg-white text-gray-700 transition-all z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {paymentError && (
          <div className="absolute top-12 left-0 right-0 bg-red-100 text-red-700 px-4 py-2 text-sm text-center">
            {paymentError}
          </div>
        )}

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
