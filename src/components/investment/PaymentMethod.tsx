
import { CreditCard, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

interface PaymentMethodProps {
  accounts: PlaidAccount[];
  selectedAccount: string | null;
  loading: boolean;
  processing: boolean;
  onSelectAccount: (accountId: string) => void;
  onSubmit: () => void;
  onContinue: () => void; // Add this prop
}

export function PaymentMethod({
  accounts,
  selectedAccount,
  loading,
  processing,
  onSelectAccount,
  onSubmit,
  onContinue
}: PaymentMethodProps) {
  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <span className="text-sm font-medium">1</span>
          </div>
          <div className="flex-1 h-1 bg-blue-600" />
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 text-blue-600 flex items-center justify-center">
            <span className="text-sm font-medium">2</span>
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-center text-blue-700 mb-6">Choose a payment method</h2>
        
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-16 w-full rounded-md mb-3" />
        ))}
        
        <Skeleton className="h-12 w-full rounded-md mt-6" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center">
          <span className="text-sm font-medium">1</span>
        </div>
        <div className="flex-1 h-1 bg-blue-700" />
        <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-700 text-blue-700 flex items-center justify-center">
          <span className="text-sm font-medium">2</span>
        </div>
      </div>

      <h2 className="text-xl font-bold text-center text-blue-700 mb-6">Choose a payment method</h2>

      <div className="space-y-3 mb-6">
        {accounts.map(account => (
          <div
            key={account.id}
            className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all ${
              selectedAccount === account.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => onSelectAccount(account.id)}
          >
            <div className="mr-3">
              <div className="w-12 h-12 rounded-md bg-white border border-gray-200 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium">{account.name}</p>
              <p className="text-sm text-gray-500">{'•'.repeat(4)} {'•'.repeat(4)} {'•'.repeat(4)} {account.mask}</p>
            </div>
            {selectedAccount === account.id && (
              <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        <div className="border border-dashed border-gray-200 rounded-lg p-4 flex items-center cursor-pointer hover:border-blue-300 transition-all">
          <div className="mr-3">
            <div className="w-12 h-12 rounded-md bg-blue-50 flex items-center justify-center">
              <Plus className="h-6 w-6 text-blue-700" />
            </div>
          </div>
          <p className="font-medium text-blue-700">Add a bank account</p>
        </div>
      </div>

      <Button
        onClick={onContinue} // Changed to onContinue instead of onSubmit
        disabled={!selectedAccount || processing}
        className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {processing ? (
          <>
            <Spinner className="mr-2" size="sm" />
            Processing...
          </>
        ) : (
          "Continue"
        )}
      </Button>
    </div>
  );
}
