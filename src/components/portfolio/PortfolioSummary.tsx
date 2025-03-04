
import { UserPortfolio } from "@/types/property";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import { Wallet, TrendingUp, DollarSign, ArrowUpRight } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface PortfolioSummaryProps {
  portfolio: UserPortfolio;
}

const PortfolioSummary = ({ portfolio }: PortfolioSummaryProps) => {
  const { totalInvestment, currentValuation, overallROI, items } = portfolio;
  
  // Calculate total profit
  const profit = currentValuation - totalInvestment;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-card rounded-xl p-5 border shadow-sm space-y-2 animate-fade-in" style={{ animationDelay: "0ms" }}>
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-muted-foreground">Total Investment</h3>
          <Wallet className="h-5 w-5 text-accent/70" />
        </div>
        <p className="text-2xl font-semibold">{formatCurrency(totalInvestment)}</p>
        <p className="text-xs text-muted-foreground">
          Across {items.length} properties
        </p>
      </div>
      
      <div className="bg-card rounded-xl p-5 border shadow-sm space-y-2 animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-muted-foreground">Revenue Generated</h3>
          <DollarSign className="h-5 w-5 text-accent/70" />
        </div>
        <p className="text-2xl font-semibold">{formatCurrency(currentValuation)}</p>
        <div className="flex items-center text-xs">
          {profit >= 0 ? (
            <span className="text-green-500 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{formatCurrency(profit)}
            </span>
          ) : (
            <span className="text-red-500 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1 transform rotate-90" />
              {formatCurrency(profit)}
            </span>
          )}
        </div>
      </div>
      
      <div className="bg-card rounded-xl p-5 border shadow-sm space-y-2 animate-fade-in" style={{ animationDelay: "200ms" }}>
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-muted-foreground">Portfolio ROI</h3>
          <TrendingUp className="h-5 w-5 text-accent/70" />
        </div>
        <p className="text-2xl font-semibold">{overallROI.toFixed(2)}%</p>
        <HoverCard>
          <HoverCardTrigger asChild>
            <p className="text-xs text-muted-foreground cursor-pointer underline underline-offset-2">
              How is this calculated?
            </p>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">ROI Calculation</h4>
              <p className="text-xs text-muted-foreground">
                Return on Investment (ROI) is calculated as:<br />
                <span className="font-mono bg-muted px-1 rounded">
                  (Current Value - Initial Investment) / Initial Investment × 100
                </span>
              </p>
              <div className="text-xs pt-2 border-t">
                <p>Initial: {formatCurrency(totalInvestment)}</p>
                <p>Current: {formatCurrency(currentValuation)}</p>
                <p>Profit: {formatCurrency(profit)}</p>
                <p>ROI: {overallROI.toFixed(2)}%</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <div className="bg-card rounded-xl p-5 border shadow-sm space-y-2 animate-fade-in" style={{ animationDelay: "300ms" }}>
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-muted-foreground">Total Properties</h3>
          <svg className="h-5 w-5 text-accent/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 21h18v-9h-8v9h-2v-5H3v5z" fill="currentColor" />
            <path d="M5 12V8.35L12 3l7 5.35V12h-2V9.76L12 5.53l-5 4.23V12H5z" fill="currentColor" />
          </svg>
        </div>
        <p className="text-2xl font-semibold">{items.length}</p>
        <p className="text-xs text-muted-foreground">
          {items.reduce((sum, item) => sum + item.tokens, 0)} tokens owned
        </p>
      </div>
    </div>
  );
};

export default PortfolioSummary;
