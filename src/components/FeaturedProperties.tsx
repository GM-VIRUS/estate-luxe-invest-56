
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyGrid from "./PropertyGrid";
import { getFeaturedProperties } from "../utils/propertyData";

const FeaturedProperties = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const featuredProperties = getFeaturedProperties();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
          
          <Button
            variant="outline"
            className={`rounded-full transition-all duration-700 delay-300 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            View All Properties
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <PropertyGrid properties={featuredProperties} />
      </div>
    </section>
  );
};

export default FeaturedProperties;
