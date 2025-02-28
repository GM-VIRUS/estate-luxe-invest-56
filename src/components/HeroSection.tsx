
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import { motion, AnimatePresence } from "framer-motion";

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-background to-background/50 z-0"
        style={{ 
          backgroundImage: `radial-gradient(circle at 25% 100%, hsl(var(--accent)/0.15) 0%, transparent 25%), 
                           radial-gradient(circle at 75% 10%, hsl(var(--accent)/0.1) 0%, transparent 20%)` 
        }}
      ></div>
      
      {/* Hero content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <AnimatePresence>
            {isLoaded && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6"
                >
                  Revolutionizing Real Estate Investment
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight"
                >
                  Own Premium Real Estate
                  <span className="bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent block mt-2">
                    Token by Token
                  </span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                  className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8"
                >
                  Invest in tokenized real estate with as little as $50. Earn passive income
                  and build wealth with fractional ownership of premium properties.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                  className="flex flex-col sm:flex-row gap-4 mb-12"
                >
                  <Link to="/properties">
                    <Button size="lg" className="rounded-full px-8 py-6 bg-accent hover:bg-accent/90 group">
                      View All Properties
                      <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </Link>
                  <Link to="/how-it-works">
                    <Button size="lg" variant="outline" className="rounded-full px-8 py-6">
                      How It Works
                    </Button>
                  </Link>
                </motion.div>
              </>
            )}
          </AnimatePresence>
          
          {/* Search section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            className="w-full max-w-3xl mx-auto"
          >
            <div className="bg-card border border-border shadow-lg rounded-xl p-6">
              <h3 className="text-lg md:text-xl font-semibold mb-4 text-center">
                Find Your Next Investment
              </h3>
              <SearchBar onSearch={() => {}} />
              
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <Button variant="outline" size="sm" className="rounded-full bg-muted/50 border-muted">
                  <MapPin className="mr-1 h-3 w-3" /> New York
                </Button>
                <Button variant="outline" size="sm" className="rounded-full bg-muted/50 border-muted">
                  <MapPin className="mr-1 h-3 w-3" /> Miami
                </Button>
                <Button variant="outline" size="sm" className="rounded-full bg-muted/50 border-muted">
                  <MapPin className="mr-1 h-3 w-3" /> Los Angeles
                </Button>
                <Button variant="outline" size="sm" className="rounded-full bg-muted/50 border-muted">
                  <MapPin className="mr-1 h-3 w-3" /> Austin
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Animated gradient orbs */}
      <div className="absolute -bottom-24 left-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl opacity-30 animate-float"></div>
      <div className="absolute top-32 right-1/3 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl opacity-20 animate-float delay-700"></div>
    </div>
  );
};

export default HeroSection;
