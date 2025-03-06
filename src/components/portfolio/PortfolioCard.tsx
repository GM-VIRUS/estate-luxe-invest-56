
import { useState } from "react";
import { Link } from "react-router-dom";
import { PortfolioItem } from "@/types/property";
import { Property } from "@/types/property";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercentage } from "@/utils/formatters";
import { 
  Building, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  TrendingUp, 
  Clock, 
  Coins,
  FileText,
  Tag
} from "lucide-react";
import TransactionHistory from "./TransactionHistory";
import { Badge } from "@/components/ui/badge";

interface PortfolioCardProps {
  item: PortfolioItem;
  property: Property;
}

const PortfolioCard = ({ item, property }: PortfolioCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate ROI
  const roi = ((item.currentValuation - item.initialInvestment) / item.initialInvestment) * 100;
  
  // Calculate percentage of property owned
  const percentageOwned = ((item.tokens / property.totalSupply) * 100).toFixed(2);
  
  return (
    <Card 
      className={`property-card overflow-hidden transition-all duration-300 ${
        isHovered ? "transform scale-[1.02]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="grid md:grid-cols-[220px_1fr] gap-4">
        <div className="relative aspect-square md:aspect-[4/5] overflow-hidden rounded-md m-4 md:m-0 md:rounded-l-lg md:rounded-r-none">
          <img 
            src={property.imageUrl} 
            alt={property.title} 
            className="w-full h-full object-cover transition-transform duration-500 ease-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-accent/90 text-white text-xs font-medium rounded-full">
              {property.propertyType}
            </span>
            {property.status === "Sold Out" && (
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                Sold Out
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col p-4 md:p-6">
          <CardHeader className="p-0 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl mb-1">{property.title}</CardTitle>
                <CardDescription className="flex items-center text-sm">
                  <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                  {property.city}, {property.state}
                </CardDescription>
              </div>
              <div className="flex items-center text-sm font-medium bg-accent/10 text-accent px-3 py-1.5 rounded-full">
                <TrendingUp className="h-4 w-4 mr-1" />
                {roi.toFixed(1)}% ROI
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 space-y-4 flex-grow">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">My Investment</p>
                <p className="text-sm font-medium">{formatCurrency(item.initialInvestment)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Current Value</p>
                <p className="text-sm font-medium">{formatCurrency(item.currentValuation)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Tokens Owned</p>
                <p className="text-sm font-medium">{item.tokens} tokens</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Ownership</p>
                <p className="text-sm font-medium">{percentageOwned}%</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20">
                <Tag className="h-3 w-3 mr-1" />
                {formatCurrency(property.pricePerToken)} per token
              </Badge>
            </div>
          </CardContent>
          
          <CardFooter className="p-0 pt-4 flex flex-wrap gap-3">
            <Button asChild variant="secondary" size="sm" className="flex-1">
              <Link to={`/property/${property.id}`}>
                View Property
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link to={`/transactions`} className="transition-colors hover:text-accent">
                <FileText className="h-4 w-4 mr-1" />
                Transactions
              </Link>
            </Button>
            
            <Collapsible
              open={isOpen}
              onOpenChange={setIsOpen}
              className="w-full"
            >
              <CollapsibleTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-accent/20 text-accent hover:bg-accent/5 hover:text-accent"
                >
                  {isOpen ? (
                    <>
                      Hide Details
                      <ChevronUp className="h-4 w-4 ml-1" />
                    </>
                  ) : (
                    <>
                      Show Details
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-4 space-y-4 animate-accordion-down">
                <div className="space-y-2 border-t pt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Purchase Date: {new Date(item.purchaseDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Coins className="h-4 w-4 mr-2" />
                    <span>Token Ownership: {percentageOwned}% of property</span>
                  </div>
                </div>
                
                <TransactionHistory transactions={item.transactions} />
              </CollapsibleContent>
            </Collapsible>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default PortfolioCard;
