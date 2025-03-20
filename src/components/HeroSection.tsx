
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import MacbookScrollDemo from "./macbook-scroll-demo";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="container mx-auto px-4 pt-16 lg:pt-20">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className="w-full lg:w-1/2">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Invest in Real Estate Tokens <br className="hidden sm:inline" />
                <span className="text-accent">Without the Barriers</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Own fractions of premium properties, earn passive income, and build a diversified real estate portfolio with as little as $100.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/properties">
                  <Button size="lg" className="rounded-full">
                    Browse Properties
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="lg" variant="outline" className="rounded-full">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <MacbookScrollDemo />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pt-8 pb-12">
        <div className="max-w-3xl mx-auto">
          <SearchBar />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
