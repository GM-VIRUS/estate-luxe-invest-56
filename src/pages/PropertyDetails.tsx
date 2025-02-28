
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, MapPin, DollarSign, CalendarDays, LineChart, Share2, Heart, ArrowRight, BarChart3, BadgePercent, Building, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPropertyDetails } from "../utils/propertyData";
import { formatCurrency, formatDate } from "../utils/formatters";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState(id ? getPropertyDetails(id) : undefined);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      const propertyData = getPropertyDetails(id);
      setProperty(propertyData);
    }
    
    setIsLoaded(true);
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, [id]);

  if (!property) {
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

  return (
    <div className={`min-h-screen transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <Navbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <Link
              to="/"
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
                  {property.location}, {property.city}, {property.state}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="rounded-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" className="rounded-full">
                <Heart className="h-4 w-4 mr-2" />
                Save
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
                    <span className="text-sm text-muted-foreground">Size</span>
                    <span className="font-medium">{property.squareFeet} sq ft</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg">
                    <CalendarDays className="h-6 w-6 text-accent mb-2" />
                    <span className="text-sm text-muted-foreground">Year Built</span>
                    <span className="font-medium">{property.yearBuilt}</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg">
                    <BadgePercent className="h-6 w-6 text-accent mb-2" />
                    <span className="text-sm text-muted-foreground">Rental Yield</span>
                    <span className="font-medium">{property.rentalYield}%</span>
                  </div>
                </div>
              </div>

              {/* Amenities Section */}
              <div className="bg-card rounded-xl shadow-sm border p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center p-3 bg-background rounded-lg">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Property History */}
              <div className="bg-card rounded-xl shadow-sm border p-6 mb-8">
                <h2 className="text-2xl font-semibold mb-4">Ownership History</h2>
                <div className="space-y-6">
                  {property.ownershipHistory.map((event, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-accent/30">
                      <div className="absolute left-[-8px] top-0 w-4 h-4 bg-accent rounded-full"></div>
                      <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                      <h4 className="font-medium">{event.event}</h4>
                      <p>{event.description}</p>
                    </div>
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
                  {property.location}, {property.city}, {property.state} {property.zipCode}
                </p>
              </div>
            </div>

            <div>
              {/* Investment Details Card */}
              <div className="bg-card rounded-xl shadow-sm border p-6 mb-8 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Investment Details</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Property Value</span>
                    <span className="font-medium">{formatCurrency(property.totalValue)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Price per Token</span>
                    <span className="font-medium">{formatCurrency(property.pricePerToken)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Supply</span>
                    <span className="font-medium">{property.totalSupply} tokens</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Available Tokens</span>
                    <span className="font-medium text-accent">{property.availableTokens} tokens</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Min. Investment</span>
                    <span className="font-medium">{formatCurrency(property.investmentDetails.minimumInvestment)}</span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Funding Progress</span>
                      <span className="text-sm text-accent font-medium">
                        {Math.round(((property.totalSupply - property.availableTokens) / property.totalSupply) * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${Math.round(((property.totalSupply - property.availableTokens) / property.totalSupply) * 100)}%` 
                        }}
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
                      <p className="text-sm text-muted-foreground">Projected ROI</p>
                      <p className="font-medium">{property.roi}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rental Yield</p>
                      <p className="font-medium">{property.rentalYield}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Appreciation</p>
                      <p className="font-medium">{property.appreciationRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Holding Period</p>
                      <p className="font-medium">{property.investmentDetails.holdingPeriod}</p>
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

              {/* Price History Card */}
              <div className="bg-card rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Price History</h2>
                  <LineChart className="h-5 w-5 text-accent" />
                </div>
                
                <div className="space-y-3">
                  {property.priceHistory.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2">
                      <span className="text-sm text-muted-foreground">{formatDate(item.date)}</span>
                      <span className={`font-medium ${
                        index > 0 && item.price > property.priceHistory[index - 1].price
                          ? "text-green-500"
                          : index > 0 && item.price < property.priceHistory[index - 1].price
                          ? "text-red-500"
                          : ""
                      }`}>
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  ))}
                </div>
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
