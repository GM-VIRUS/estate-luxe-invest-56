
import { useState, useEffect } from "react";
import { properties } from "../utils/propertyData";
import { useSavedProperties } from "../contexts/SavedPropertiesContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PropertyGrid from "../components/PropertyGrid";
import SearchBar from "../components/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, List } from "lucide-react";
import { cn } from "@/lib/utils";

const Properties = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const { savedProperties } = useSavedProperties();
  
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
    <div className={`min-h-screen bg-background transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <Navbar />
      
      <div className="pt-24 pb-16">
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
          
          <div className="mx-auto max-w-7xl">
            <Tabs 
              defaultValue="all" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-[400px] grid-cols-2 h-14 rounded-xl bg-card/50 p-1 backdrop-blur-sm">
                  <TabsTrigger 
                    value="all" 
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg py-3 text-base font-medium transition-all",
                      activeTab === "all" ? "bg-accent text-white shadow-sm" : "text-foreground/70 hover:text-foreground hover:bg-accent/10"
                    )}
                  >
                    <List className="h-5 w-5" />
                    All Properties
                  </TabsTrigger>
                  <TabsTrigger 
                    value="saved" 
                    disabled={!hasSavedProperties}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-lg py-3 text-base font-medium transition-all",
                      activeTab === "saved" ? "bg-accent text-white shadow-sm" : "text-foreground/70 hover:text-foreground hover:bg-accent/10",
                      !hasSavedProperties && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Heart className={cn("h-5 w-5", hasSavedProperties && activeTab === "saved" && "fill-white")} />
                    Saved Properties 
                    {hasSavedProperties && (
                      <span className="ml-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-semibold">
                        {savedProperties.length}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent 
                value="all" 
                className="focus-visible:outline-none focus-visible:ring-0"
              >
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
                    title={searchTerm ? "Search Results" : null}
                  />
                )}
              </TabsContent>
              
              <TabsContent 
                value="saved" 
                className="focus-visible:outline-none focus-visible:ring-0"
              >
                {hasSavedProperties && (
                  <PropertyGrid 
                    properties={savedProperties}
                    title={null}
                  />
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
