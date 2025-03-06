
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

  useEffect(() => {
    if (isOpen && !isInitialized) {
      // Use the property id correctly
      const apiPropertyId = property.id;
      console.log("Fetching property details with ID:", apiPropertyId);
      fetchPropertyDetails(apiPropertyId);
      setIsInitialized(true);
    }
  }, [isOpen, property, isInitialized, fetchPropertyDetails]);

  useEffect(() => {
    if (!isOpen) {
      // Reset on close with a small delay to allow animation
      const timer = setTimeout(() => {
        reset();
        setIsInitialized(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, reset]);

  const handleSubmitPayment = async () => {
    // Use the property id correctly
    const apiPropertyId = property.id;
    
    try {
      console.log("Processing payment for property:", apiPropertyId);
      const success = await processPayment(apiPropertyId);
      if (success) {
        toast.success("Investment successful!");
        onClose();
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error("There was an error processing your payment. Please try again.");
    }
  };

  const handleContinueToConfirmation = () => {
    if (!selectedAccount) {
      toast.error("Please select a payment method");
      return;
    }
    
    proceedToConfirmation();
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

        {step === 'amount' ? (
          <InvestAmount
            property={property}
            details={propertyDetails}
            amount={amount}
            shares={shares}
            onAmountChange={handleAmountChange}
            onProceed={proceedToPayment}
          />
        ) : step === 'payment' ? (
          <PaymentMethod
            accounts={accounts}
            selectedAccount={selectedAccount}
            loading={loadingAccounts}
            processing={processingPayment}
            onSelectAccount={setSelectedAccount}
            onSubmit={handleSubmitPayment}
            onContinue={handleContinueToConfirmation}
          />
        ) : (
          <OrderConfirmation
            property={property}
            amount={Number(amount)}
            selectedAccount={accounts.find(acc => acc.id === selectedAccount)}
            processing={processingPayment}
            onConfirm={handleSubmitPayment}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
