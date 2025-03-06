import { useState } from "react";
import { Link } from "react-router-dom";
import { Property } from "../types/property";
import { MapPin, TrendingUp, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "../utils/formatters";
import { useSavedProperties } from "../contexts/SavedPropertiesContext";
import { Badge } from "@/components/ui/badge";
import { InvestModal } from "./investment/InvestModal";
import { toast } from "sonner";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const { isSaved, saveProperty } = useSavedProperties();

  const progressPercentage = Math.round(
    ((property.totalSupply - property.availableTokens) / property.totalSupply) * 100
  );

  // Determine if property is sold out
  const isSoldOut = property.availableTokens === 0 || property.status === "Fully Funded";

  // Handler to save the property
  const handleSaveProperty = () => {
    saveProperty(property);
  };

  const handleOpenInvestModal = () => {
    // Don't allow investment if sold out
    if (isSoldOut) {
      toast.info("This property is sold out");
      return;
    }
    console.log("Opening investment modal for property:", property);
    setShowInvestModal(true);
  };

  const handleCloseInvestModal = () => {
    setShowInvestModal(false);
  };

  return (
    <>
      <div className="property-card rounded-xl overflow-hidden bg-card border border-border hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className={`absolute inset-0 bg-gray-200 ${isImageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} />
          <img
            src={property.imageUrl}
            alt={property.title}
            className={`w-full h-full object-cover transition-all duration-700 ${isImageLoaded ? 'scale-100 blur-0' : 'scale-105 blur-md'}`}
            onLoad={() => setIsImageLoaded(true)}
          />
          
          <div className="absolute top-0 left-0 p-3 flex gap-2">
            {property.featured && (
              <div className="bg-accent text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center">
                <Star className="h-3 w-3 mr-1" />
                Trending
              </div>
            )}
          </div>
          
          <div className="absolute top-3 right-3 flex gap-2">
            {isSoldOut && (
              <div className="bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                Sold Out
              </div>
            )}
            <div className="bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
              {property.propertyType}
            </div>
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold line-clamp-1 hover:text-accent transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center text-sm font-medium text-accent">
              <TrendingUp className="h-4 w-4 mr-1" />
              {property.roi}% ROI
            </div>
          </div>

          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <MapPin className="h-4 w-4 mr-1 shrink-0" />
            <span className="truncate">{property.city}, {property.state}</span>
          </div>

          <div className="space-y-4 mb-6 flex-grow">
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

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Token Price</p>
                <p className="font-medium">{formatCurrency(property.pricePerToken)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Min. Investment</p>
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

            <div className="flex flex-wrap gap-2 mt-3">
              {property.amenities?.slice(0, 3).map((amenity, index) => (
                <Badge key={index} variant="outline" className="bg-accent/5 text-accent border-accent/20">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              asChild 
              className="rounded-full bg-accent hover:bg-accent/90 text-white transition-all flex-1"
            >
              <Link to={`/property/${property.id}`}>
                View Details
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button 
              onClick={handleOpenInvestModal}
              variant="outline" 
              className={`rounded-full border-accent/20 text-accent hover:bg-accent/5 transition-all flex-1 ${
                isSoldOut ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSoldOut}
            >
              {isSoldOut ? "Sold Out" : "Invest Now"}
            </Button>
          </div>
        </div>
      </div>
      
      {!isSoldOut && (
        <InvestModal 
          property={property}
          isOpen={showInvestModal}
          onClose={handleCloseInvestModal}
        />
      )}
    </>
  );
};

export default PropertyCard;
