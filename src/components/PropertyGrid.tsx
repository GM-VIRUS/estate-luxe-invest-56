
import { useState, useEffect } from "react";
import { Property } from "../types/property";
import PropertyCard from "./PropertyCard";

interface PropertyGridProps {
  properties: Property[];
  title?: string;
  subtitle?: string;
}

const PropertyGrid = ({ properties, title, subtitle }: PropertyGridProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && (
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-700 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}>
              {title}
            </h2>
          )}
          {subtitle && (
            <p className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {properties.map((property, index) => (
          <div
            key={property.id}
            className={`transition-all duration-700 ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
            style={{ transitionDelay: `${100 + index * 100}ms` }}
          >
            <PropertyCard property={property} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyGrid;
