
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MapPin, DollarSign, CalendarDays, LineChart, Share2, Heart, ArrowRight, BarChart3, BadgePercent, Building, Home, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "../utils/formatters";
import { useSavedProperties } from "../contexts/SavedPropertiesContext";
import { shareProperty } from "../utils/shareUtils";
import { usePropertyList } from "../hooks/usePropertyList";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data: properties, isLoading: isLoadingProperties } = usePropertyList();
  const [property, setProperty] = useState(undefined);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { saveProperty, isSaved } = useSavedProperties();
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (id && properties) {
      const foundProperty = properties.find(p => p.id === id);
      setProperty(foundProperty);
    }
    
    setIsLoaded(true);
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [id, properties]);

  const handleSaveProperty = () => {
    if (property) {
      saveProperty(property);
    }
  };

  const handleShareProperty = () => {
    if (property) {
      setIsSharing(true);
      shareProperty(property.id, property.title);
      
      // Reset the icon after a short delay
      setTimeout(() => {
        setIsSharing(false);
      }, 2000);
    }
  };

  if (isLoadingProperties) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <div className="mb-6">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
              <div className="w-full md:w-2/3">
                <Skeleton className="h-10 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-32 rounded-full" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              <Skeleton className="md:col-span-2 h-[400px] rounded-xl" />
              <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                <Skeleton className="h-[190px] rounded-xl" />
                <Skeleton className="h-[190px] rounded-xl" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property && !isLoadingProperties) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const progressPercentage = Math.round(
    ((property.totalSupply - property.availableTokens) / property.totalSupply) * 100
  );

  return (
    <div className={`min-h-screen transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Link
              to="/properties"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-accent transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Properties
            </Link>
          </div>

          {/* Property Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{property.title}</h1>
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-5 w-5 mr-1" />
                <span>
                  {property.city}, {property.state}, {property.country}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                className="rounded-full" 
                onClick={handleShareProperty}
              >
                {isSharing ? (
                  <Clipboard className="h-4 w-4 mr-2" />
                ) : (
                  <Share2 className="h-4 w-4 mr-2" />
                )}
                {isSharing ? "Copied!" : "Share"}
              </Button>
              <Button 
                variant="outline" 
                className={`rounded-full ${isSaved(property.id) ? 'bg-accent/10 text-accent border-accent/30' : ''}`}
                onClick={handleSaveProperty}
              >
                <Heart 
                  className={`h-4 w-4 mr-2 ${isSaved(property.id) ? 'fill-accent text-accent' : ''}`} 
                />
                {isSaved(property.id) ? "Saved" : "Save"}
              </Button>
              <Button className="rounded-full bg-accent hover:bg-accent/90 text-white">
                Invest Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="md:col-span-2 rounded-xl overflow-hidden aspect-video">
              <img
                src={property.images[activeImage]}
                alt={property.title}
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {property.images.map((image, index) => (
                <div
                  key={index}
                  className={`rounded-xl overflow-hidden aspect-video cursor-pointer transition-all duration-300 ${
                    activeImage === index ? "ring-2 ring-accent" : "opacity-70 hover:opacity-100"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={image}
                    alt={`${property.title} - View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Property Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              {/* Description Section */}
              <div className="bg-card rounded-xl shadow-sm border p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Property Overview</h2>
                <p className="text-muted-foreground mb-6">{property.description}</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg">
                    <Home className="h-6 w-6 text-accent mb-2" />
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span className="font-medium">{property.propertyType}</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg">
                    <Building className="h-6 w-6 text-accent mb-2" />
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="font-medium">{property.city}</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg">
                    <CalendarDays className="h-6 w-6 text-accent mb-2" />
                    <span className="text-sm text-muted-foreground">Total Tokens</span>
                    <span className="font-medium">{property.totalSupply}</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg">
                    <BadgePercent className="h-6 w-6 text-accent mb-2" />
                    <span className="text-sm text-muted-foreground">Annual ROI</span>
                    <span className="font-medium">{property.roi}%</span>
                  </div>
                </div>
              </div>

              {/* Amenities/Tags Section */}
              <div className="bg-card rounded-xl shadow-sm border p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Features</h2>
                <div className="flex flex-wrap gap-3">
                  {property.amenities.map((tag, index) => (
                    <Badge key={index} variant="outline" className="py-2 px-4 text-sm bg-accent/5 text-accent border-accent/20">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Property Location - Placeholder for map */}
              <div className="bg-card rounded-xl shadow-sm border p-6">
                <h2 className="text-2xl font-semibold mb-4">Location</h2>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center p-8">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-accent" />
                    <p>Interactive map would be displayed here</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  {property.city}, {property.state}, {property.country}
                </p>
              </div>
            </div>

            <div>
              {/* Investment Details Card */}
              <div className="bg-card rounded-xl shadow-sm border p-6 mb-8 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Investment Details</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Token Price</span>
                    <span className="font-medium">{formatCurrency(property.pricePerToken)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Min Investment</span>
                    <span className="font-medium">{formatCurrency(property.pricePerToken)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Supply</span>
                    <span className="font-medium">{property.totalSupply} tokens</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Available</span>
                    <span className="font-medium text-accent">{property.availableTokens} tokens</span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Funding Progress</span>
                      <span className="text-sm text-accent font-medium">
                        {progressPercentage}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-accent">
                    <BarChart3 className="h-5 w-5" />
                    <span className="font-medium">Investment Metrics</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 p-4 bg-background rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Annual ROI</p>
                      <p className="font-medium">{property.roi}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Yearly Return</p>
                      <p className="font-medium">{property.rentalYield}%</p>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full rounded-full mb-3 bg-accent text-white hover:bg-accent/90">
                  Invest Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  By investing, you agree to our terms and conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PropertyDetails;
