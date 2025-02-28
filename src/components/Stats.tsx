
import { useState, useEffect } from "react";
import { Users, Building, DollarSign, Award } from "lucide-react";

const Stats = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [counts, setCounts] = useState({
    investors: 0,
    properties: 0,
    invested: 0,
    years: 0
  });

  const targets = {
    investors: 15000,
    properties: 348,
    invested: 250,
    years: 7
  };

  useEffect(() => {
    setIsLoaded(true);
    
    const duration = 2000; // Animation duration in ms
    const interval = 20; // Update interval in ms
    const steps = duration / interval;
    
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCounts({
        investors: Math.floor(progress * targets.investors),
        properties: Math.floor(progress * targets.properties),
        invested: Math.floor(progress * targets.invested),
        years: Math.floor(progress * targets.years)
      });
      
      if (step >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      icon: <Users className="h-8 w-8" />,
      value: counts.investors.toLocaleString(),
      label: "Active Investors",
      suffix: "+"
    },
    {
      icon: <Building className="h-8 w-8" />,
      value: counts.properties.toLocaleString(),
      label: "Properties Tokenized",
      suffix: ""
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      value: counts.invested.toLocaleString(),
      label: "Million Invested",
      prefix: "$",
      suffix: "M+"
    },
    {
      icon: <Award className="h-8 w-8" />,
      value: counts.years.toLocaleString(),
      label: "Years Experience",
      suffix: "+"
    }
  ];

  return (
    <section className="py-16 bg-accent text-white">
      <div className="container mx-auto px-4">
        <div 
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="mb-4">
                {stat.icon}
              </div>
              <div className="text-4xl font-bold mb-2 flex items-center">
                {stat.prefix && <span>{stat.prefix}</span>}
                <span>{stat.value}</span>
                {stat.suffix && <span>{stat.suffix}</span>}
              </div>
              <div className="text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
