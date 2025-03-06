
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useInvestment } from "@/hooks/useInvestment";
import { Property } from "@/types/property";
import { InvestAmount } from "./InvestAmount";
import { PaymentMethod } from "./PaymentMethod";
import { Skeleton } from "@/components/ui/skeleton";

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
    setSelectedAccount,
    handleAmountChange,
    fetchPropertyDetails,
    proceedToPayment,
    processPayment,
    reset
  } = useInvestment();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (isOpen && !isInitialized) {
      fetchPropertyDetails(property.id);
      setIsInitialized(true);
    }
  }, [isOpen, property.id, isInitialized]);

  useEffect(() => {
    if (!isOpen) {
      // Reset on close with a small delay to allow animation
      const timer = setTimeout(() => {
        reset();
        setIsInitialized(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmitPayment = async () => {
    const success = await processPayment(property.id);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
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
        ) : (
          <PaymentMethod
            accounts={accounts}
            selectedAccount={selectedAccount}
            loading={loadingAccounts}
            processing={processingPayment}
            onSelectAccount={setSelectedAccount}
            onSubmit={handleSubmitPayment}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
