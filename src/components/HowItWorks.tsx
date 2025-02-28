
import { useState, useEffect } from "react";
import { Search, Coins, BarChart3, Wallet } from "lucide-react";

const HowItWorks = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const steps = [
    {
      icon: <Search className="h-7 w-7" />,
      title: "Browse Properties",
      description: "Explore our curated selection of premium real estate investment opportunities."
    },
    {
      icon: <Coins className="h-7 w-7" />,
      title: "Purchase Tokens",
      description: "Buy fractional ownership tokens representing your share of the property."
    },
    {
      icon: <BarChart3 className="h-7 w-7" />,
      title: "Earn Passive Income",
      description: "Receive your share of rental income and property appreciation."
    },
    {
      icon: <Wallet className="h-7 w-7" />,
      title: "Manage Your Portfolio",
      description: "Track performance and trade your property tokens anytime."
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <span className={`inline-block px-4 py-1.5 mb-4 text-xs font-semibold uppercase tracking-wider bg-accent/20 text-accent rounded-full transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            Simple Process
          </span>
          
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 transition-all duration-700 delay-100 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            How It Works
          </h2>
          
          <p className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}>
            Our platform makes real estate investing accessible to everyone through blockchain technology and fractional ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`flex flex-col items-center text-center p-6 rounded-xl transition-all duration-700 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <div className="w-16 h-16 mb-6 bg-accent/10 text-accent rounded-full flex items-center justify-center">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
