
import { useEffect, useState } from "react";
import { properties } from "../utils/propertyData";
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
      <PropertyGrid 
        properties={properties}
        title="Browse All Properties"
        subtitle="Discover our diverse portfolio of tokenized real estate investment opportunities across prime locations."
      />
      <Stats />
      <Footer />
    </div>
  );
};

export default Index;
