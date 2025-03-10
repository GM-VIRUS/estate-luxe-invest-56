
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import Stats from "./Stats";
import { properties } from "../utils/propertyData";

const HeroSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState(properties);

  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const slides = [
    {
      imageUrl: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&q=80",
      heading: "Invest in Premium Real Estate",
      subheading: "Fractional ownership made simple, transparent, and accessible."
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1439337153520-7082a56a81f4?auto=format&fit=crop&q=80",
      heading: "Diversify Your Investments",
      subheading: "Access exclusive properties and earn passive income through rental yields."
    },
    {
      component: Stats,
      heading: "Our Track Record",
      subheading: "Building trust through consistent performance and proven expertise."
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleSearch = (query: string, priceRange: string, propertyType: string) => {
    let filtered = [...properties];
    
    // Filter by search term
    if (query) {
      filtered = filtered.filter(
        property => 
          property.title.toLowerCase().includes(query.toLowerCase()) ||
          property.city.toLowerCase().includes(query.toLowerCase()) ||
          property.state.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    // Filter by price range
    if (priceRange !== "Any") {
      if (priceRange === "5000000+") {
        filtered = filtered.filter(property => property.totalValue >= 5000000);
      } else {
        const [min, max] = priceRange.split('-').map(v => parseInt(v));
        filtered = filtered.filter(property => 
          property.totalValue >= min && property.totalValue <= max
        );
      }
    }
    
    // Filter by property type
    if (propertyType !== "All") {
      filtered = filtered.filter(property => 
        property.propertyType === propertyType
      );
    }
    
    setFilteredProperties(filtered);
    
    // Pass filtered properties to parent component or context
    // This could be implemented using a context or props
    console.log("Filtered properties:", filtered);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeSlide === index ? "opacity-100" : "opacity-0"
            }`}
          >
            {slide.imageUrl ? (
              <>
                <img
                  src={slide.imageUrl}
                  alt={slide.heading}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 backdrop-blur-[2px]" />
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent/90 via-accent/80 to-accent/70" />
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <span className={`inline-block px-4 py-1.5 mb-6 text-xs font-semibold uppercase tracking-wider bg-accent/20 rounded-full border border-accent/40 transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            Tokenized Real Estate Investment
          </span>
          
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 transition-all duration-700 delay-100 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {slides[activeSlide].heading}
          </h1>
          
          <p className={`text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto transition-all duration-700 delay-200 ${isLoaded ? "opacity-90 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {slides[activeSlide].subheading}
          </p>
          
          {activeSlide === 2 ? (
            <div className={`transition-all duration-700 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <Stats />
            </div>
          ) : (
            <div className={`flex flex-col sm:flex-row justify-center items-center gap-4 transition-all duration-700 delay-300 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <Button size="lg" className="rounded-full bg-accent hover:bg-accent/90 text-white px-8 py-6">
                Start Investing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full border-white/20 text-white hover:bg-white/10 px-8 py-6"
                onClick={scrollToHowItWorks}
              >
                Learn How It Works
              </Button>
            </div>
          )}
        </div>

        {activeSlide !== 2 && (
          <div className={`mt-12 md:mt-16 max-w-4xl mx-auto transition-all duration-700 delay-400 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <SearchBar onSearch={handleSearch} />
          </div>
        )}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSlide === index
                  ? "bg-white w-10"
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
