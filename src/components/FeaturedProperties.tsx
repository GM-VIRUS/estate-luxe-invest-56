
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyGrid from "./PropertyGrid";
import { usePropertyList } from "../hooks/usePropertyList";

const FeaturedProperties = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { properties, isLoading, error } = usePropertyList();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Filter trending properties
  const featuredProperties = properties?.filter(prop => prop.featured) || [];

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className={`inline-block px-4 py-1.5 mb-4 text-xs font-semibold uppercase tracking-wider bg-accent/20 text-accent rounded-full transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            Featured Opportunities
          </span>
          
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-700 delay-100 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            Top-Rated Investment Properties
          </h2>
          
          <p className={`text-lg text-muted-foreground max-w-2xl mx-auto mb-8 transition-all duration-700 delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            Discover our handpicked selection of high-yield properties with strong growth potential and proven returns.
          </p>
          
          <Link to="/properties">
            <Button
              variant="outline"
              className={`rounded-full transition-all duration-700 delay-300 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {error ? (
          <div className="text-center p-8 bg-red-50 rounded-lg">
            <p className="text-red-500">Failed to load properties. Please try again later.</p>
          </div>
        ) : (
          <PropertyGrid 
            properties={featuredProperties} 
            isLoading={isLoading}
          />
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
