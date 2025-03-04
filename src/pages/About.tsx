
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Globe, Shield, Trophy, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TeamMember = ({ name, role, image }: { name: string; role: string; image: string }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-accent/20">
      <img src={image} alt={name} className="w-full h-full object-cover" />
    </div>
    <h3 className="text-lg font-semibold">{name}</h3>
    <p className="text-sm text-muted-foreground">{role}</p>
  </div>
);

const About = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);
  }, []);

  const team = [
    { name: "Emma Robertson", role: "CEO & Founder", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80" },
    { name: "Michael Chen", role: "Chief Investment Officer", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80" },
    { name: "Sophia Williams", role: "Head of Operations", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80" },
    { name: "James Peterson", role: "Lead Developer", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80" },
  ];

  return (
    <div className={`min-h-screen bg-background transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <Navbar />
      
      <div className="pt-24 md:pt-32 pb-16">
        {/* Hero Section */}
        <div className="container mx-auto px-4 mb-16 md:mb-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About EstateLuxe</h1>
            <p className="text-xl text-muted-foreground mb-8">
              We're democratizing real estate investing through blockchain technology,
              making premium properties accessible to everyone.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild className="rounded-full bg-accent hover:bg-accent/90 text-white">
                <Link to="/properties">
                  Browse Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Our Mission */}
        <div className="container mx-auto px-4 mb-16 md:mb-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg mb-6 text-muted-foreground">
                At EstateLuxe, we believe that everyone should have access to the wealth-building 
                potential of real estate. Our platform leverages blockchain technology to 
                fractionally tokenize premium properties, allowing investors to build diversified 
                portfolios with minimal capital.
              </p>
              <p className="text-lg mb-6 text-muted-foreground">
                We're committed to transparency, security, and creating sustainable wealth for our 
                community of investors. By removing traditional barriers to real estate investing, 
                we're opening up new possibilities for financial growth.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&q=80" 
                alt="Our mission" 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex flex-col justify-end p-6">
                <div className="text-lg font-semibold mb-2">Real Estate for Everyone</div>
                <p>Breaking barriers in property investment since 2020</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Our Values */}
        <div className="bg-muted/30 py-16 md:py-24 mb-16 md:mb-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <Users className="h-10 w-10 text-accent mb-4" />
                  <CardTitle>Accessibility</CardTitle>
                  <CardDescription>
                    Making premium real estate investments available to everyone
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    We lower the entry barrier to real estate investing, allowing users to start with 
                    as little as $100, while providing the same quality of investments available to 
                    high-net-worth individuals.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <Globe className="h-10 w-10 text-accent mb-4" />
                  <CardTitle>Transparency</CardTitle>
                  <CardDescription>
                    Clear information about every property and transaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    We provide comprehensive property details, due diligence reports, 
                    performance metrics, and transaction records on the blockchain for full 
                    transparency and trust.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <Shield className="h-10 w-10 text-accent mb-4" />
                  <CardTitle>Security</CardTitle>
                  <CardDescription>
                    State-of-the-art protection for your investments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    We implement the highest security standards for our blockchain platform, 
                    with regular audits and compliance with real estate regulations to protect 
                    your investments.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Our Team */}
        <div className="container mx-auto px-4 mb-16 md:mb-24">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
            {team.map((member, index) => (
              <TeamMember key={index} {...member} />
            ))}
          </div>
        </div>
        
        {/* Achievements */}
        <div className="container mx-auto px-4 mb-16">
          <div className="bg-accent/10 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Achievements</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex items-start">
                <Trophy className="h-8 w-8 text-accent mr-4 shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Best Fintech Innovation</h3>
                  <p className="text-muted-foreground">Blockchain Real Estate Awards 2023</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="h-8 w-8 text-accent mr-4 shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">$100M+ in Tokenized Properties</h3>
                  <p className="text-muted-foreground">Across 50+ premium locations</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Users className="h-8 w-8 text-accent mr-4 shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">10,000+ Active Investors</h3>
                  <p className="text-muted-foreground">From over 30 countries worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
