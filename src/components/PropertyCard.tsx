import { useState } from "react";
import { Link } from "react-router-dom";
import { Property } from "../types/property";
import { MapPin, TrendingUp, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "../utils/formatters";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const progressPercentage = Math.round(
    ((property.totalSupply - property.availableTokens) / property.totalSupply) * 100
  );

  return (
    <div className="property-card group rounded-xl overflow-hidden bg-card border border-border cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className={`absolute inset-0 bg-gray-200 ${isImageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} />
        <img
          src={property.imageUrl}
          alt={property.title}
          className={`w-full h-full object-cover transition-all duration-700 ${isImageLoaded ? 'scale-100 blur-0' : 'scale-105 blur-md'}`}
          onLoad={() => setIsImageLoaded(true)}
        />
        
        {property.featured && (
          <div className="absolute top-3 left-3 bg-accent/90 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </div>
        )}
        
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full">
          {property.propertyType}
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-accent transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center text-sm font-medium text-accent">
            <TrendingUp className="h-4 w-4 mr-1" />
            {property.roi}% ROI
          </div>
        </div>

        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1 shrink-0" />
          <span className="truncate">{property.city}, {property.state}</span>
        </div>

        <div className="space-y-4 mb-4">
          <div>
            <div className="text-sm font-medium mb-1 flex justify-between">
              <span>Investment Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Total Value</p>
              <p className="font-medium">{formatCurrency(property.totalValue)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Price Per Token</p>
              <p className="font-medium">{formatCurrency(property.pricePerToken)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Supply</p>
              <p className="font-medium">{property.totalSupply} tokens</p>
            </div>
            <div>
              <p className="text-muted-foreground">Available</p>
              <p className="font-medium">{property.availableTokens} tokens</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            asChild 
            className="flex-1 rounded-full bg-accent hover:bg-accent/90 text-white transition-all"
          >
            <Link to={`/property/${property.id}`}>
              View Details
              <ExternalLink className="h-4 w-4 ml-1" />
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 rounded-full border-accent/20 text-accent hover:bg-accent/5 transition-all"
          >
            Invest Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
