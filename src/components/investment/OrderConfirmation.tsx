
import { Check, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { formatCurrency } from "@/utils/formatters";
import { Spinner } from "@/components/ui/spinner";

interface PlaidAccount {
  id: string;
  name: string;
  mask: string;
  type: string;
  subtype: string;
  balanceAvailable: number;
  balanceCurrent: number;
}

interface OrderConfirmationProps {
  property: Property;
  amount: number;
  selectedAccount: PlaidAccount | undefined;
  processing: boolean;
  onConfirm: () => void;
}

export function OrderConfirmation({
  property,
  amount,
  selectedAccount,
  processing,
  onConfirm
}: OrderConfirmationProps) {
  // Constants for fee calculations
  const investTechFees = 0; // No fees for now
  const processingFees = 0; // No processing fees
  const totalAmount = amount;

  return (
    <div className="flex flex-col h-full">
      {/* Property Image */}
      <div className="relative w-full h-40">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="h-5 w-5 text-white" />
          </div>
          <div className="h-1 w-24 bg-green-500"></div>
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white font-medium">2</span>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="p-6 flex-1">
        <h2 className="text-2xl font-bold text-blue-700 mb-1">{property.title}</h2>
        <p className="text-gray-500 uppercase text-sm mb-6">{property.city}, {property.state}</p>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Property Amount</span>
            <span className="font-medium">{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Invest Tech Fees</span>
            <span className="font-medium">{formatCurrency(investTechFees)}</span>
          </div>
          <div className="border-t border-gray-200 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total before processing</span>
            <span className="font-medium">{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Estimated processing</span>
            <span className="font-medium">{formatCurrency(processingFees)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-medium">
              {selectedAccount ? 
                `${selectedAccount.name} ${'•'.repeat(4)}${selectedAccount.mask}` : 
                'Not selected'}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <span className="text-xl font-bold">Order Total</span>
          <span className="text-2xl font-bold text-blue-700">{formatCurrency(totalAmount)}</span>
        </div>

        <Button 
          onClick={onConfirm} 
          disabled={processing}
          className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {processing ? (
            <>
              <Spinner className="mr-2" />
              Processing...
            </>
          ) : (
            "Confirm Order"
          )}
        </Button>

        <p className="text-xs text-center text-gray-500 mt-4">
          Please note: You are authorizing a one-time payment. If a problem arises, contact support@investech.global
        </p>
      </div>
    </div>
  );
}
