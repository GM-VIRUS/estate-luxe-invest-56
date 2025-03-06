
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Property } from "@/types/property";
import { formatCurrency } from "@/utils/formatters";
import { Skeleton } from "@/components/ui/skeleton";

interface InvestAmountProps {
  property: Property;
  details: {
    property?: Property;
    offeringAmount?: number;
    pricePerShare?: number;
    loading: boolean;
    error: string | null;
  };
  amount: number | '';
  shares: number;
  onAmountChange: (value: number | '') => void;
  onProceed: () => void;
}

export function InvestAmount({
  property,
  details,
  amount,
  shares,
  onAmountChange,
  onProceed
}: InvestAmountProps) {
  const offeringAmount = details.offeringAmount || property.pricePerToken * property.totalSupply;
  const pricePerShare = details.pricePerShare || property.pricePerToken;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onAmountChange('');
    } else {
      const numValue = parseFloat(value.replace(/,/g, ''));
      if (!isNaN(numValue)) {
        onAmountChange(numValue);
      }
    }
  };

  if (details.loading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-[150px] w-full rounded-md" />
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-6 w-1/2 rounded-md" />
        <Skeleton className="h-10 w-full rounded-md mt-6" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    );
  }

  if (details.error) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-red-500 mb-4">Error Loading Details</h2>
        <p className="text-muted-foreground mb-6">{details.error}</p>
        <Button onClick={onProceed} variant="outline" className="w-full">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={property.imageUrl}
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-1">{property.title}</h2>
          <p className="text-gray-500 uppercase text-sm">{property.city}, {property.state}</p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="space-y-1">
            <p className="text-gray-500">Offering Amount</p>
            <p className="text-gray-900 font-semibold text-xl">{formatCurrency(offeringAmount)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-500">Price Per Share</p>
            <p className="text-gray-900 font-semibold text-xl">{formatCurrency(pricePerShare)}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="investment-amount" className="block text-sm font-medium text-gray-700">
            Investment Amount
          </label>
          <Input
            id="investment-amount"
            type="text"
            placeholder={`eg. ${formatCurrency(offeringAmount || 1000).replace('$', '')}`}
            value={amount === '' ? '' : formatCurrency(amount).replace('$', '')}
            onChange={handleInputChange}
            className="text-lg font-semibold"
          />
          <p className="text-sm text-muted-foreground">
            {shares > 0 && `This will purchase approximately ${shares} shares`}
          </p>
        </div>

        <Button 
          onClick={onProceed} 
          disabled={!amount || amount <= 0}
          className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white py-6"
        >
          Proceed to Checkout
        </Button>
      </div>
    </>
  );
}
