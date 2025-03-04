
import { useEffect, useState } from "react";
import { properties } from "../utils/propertyData";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import PropertyGrid from "../components/PropertyGrid";
import FeaturedProperties from "../components/FeaturedProperties";
import HowItWorks from "../components/HowItWorks";
import Stats from "../components/Stats";
import Footer from "../components/Footer";

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <Navbar />
      <HeroSection />
      <FeaturedProperties />
      <HowItWorks />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Browse All Properties</h2>
          <p className="text-muted-foreground mb-6">
            Discover our diverse portfolio of tokenized real estate investment opportunities across prime locations.
          </p>
          <Link to="/properties">
            <Button className="rounded-full" size="lg">
              View All Properties
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
        <PropertyGrid 
          properties={properties.slice(0, 3)}
          title=""
          subtitle=""
        />
      </div>
      <Stats />
      <Footer />
    </div>
  );
};

export default Index;
