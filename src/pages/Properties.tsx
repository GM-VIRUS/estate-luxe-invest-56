
import { useState, useEffect } from "react";
import { properties } from "../utils/propertyData";
import { useSavedProperties } from "../contexts/SavedPropertiesContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropertyGrid from "../components/PropertyGrid";
import SearchBar from "../components/SearchBar";
import { Heart } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Properties = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [searchTerm, setSearchTerm] = useState("");
  const { savedProperties } = useSavedProperties();
  const [activeTab, setActiveTab] = useState<"all" | "saved">("all");
  
  const hasSavedProperties = savedProperties.length > 0;

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    
    if (!query) {
      setFilteredProperties(properties);
      return;
    }
    
    const filtered = properties.filter(
      property => 
        property.title.toLowerCase().includes(query.toLowerCase()) ||
        property.location.toLowerCase().includes(query.toLowerCase()) ||
        property.description.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredProperties(filtered);
  };

  return (
    <div className={`min-h-screen transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <Navbar />
      
      <div className="pt-24 pb-16 bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">All Properties</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our comprehensive collection of tokenized real estate investment opportunities across premium locations worldwide.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto mb-12">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          {/* Properties Tabs Navigation */}
          <div className="max-w-lg mx-auto mb-10">
            <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "saved")} className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-8">
                <TabsTrigger value="all" className="rounded-l-full py-3">
                  All Properties
                </TabsTrigger>
                <TabsTrigger 
                  value="saved" 
                  className="rounded-r-full py-3"
                  disabled={!hasSavedProperties}
                >
                  <Heart className={`mr-2 h-4 w-4 ${hasSavedProperties ? "text-accent fill-accent" : ""}`} />
                  Saved Properties {hasSavedProperties && `(${savedProperties.length})`}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-0">
                {filteredProperties.length === 0 ? (
                  <div className="text-center py-20">
                    <h3 className="text-2xl font-medium mb-2">No properties found</h3>
                    <p className="text-muted-foreground">
                      No properties match your search criteria "{searchTerm}". Try a different search term.
                    </p>
                  </div>
                ) : (
                  <PropertyGrid 
                    properties={filteredProperties}
                    title={searchTerm ? "Search Results" : "All Properties"}
                  />
                )}
              </TabsContent>

              <TabsContent value="saved" className="mt-0">
                {hasSavedProperties ? (
                  <PropertyGrid 
                    properties={savedProperties}
                    title="Your Saved Properties"
                    subtitle="Properties you've saved for later consideration."
                  />
                ) : (
                  <div className="text-center py-20">
                    <h3 className="text-2xl font-medium mb-2">No saved properties</h3>
                    <p className="text-muted-foreground">
                      Properties you save will appear here for easy access.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Properties;
