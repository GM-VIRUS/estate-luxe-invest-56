
import { useState, useEffect, useCallback } from "react";
import { Search, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type FAQCategory = "general" | "tokenization" | "investment" | "legal" | "technical";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
}

// FAQ data
const faqData: FAQ[] = [
  {
    id: "faq-1",
    question: "What is EstateToken?",
    answer: "EstateToken is a platform that allows you to invest in fractional real estate through blockchain technology. We tokenize high-quality properties, allowing investors to own a portion of premium real estate with lower barriers to entry.",
    category: "general"
  },
  {
    id: "faq-2",
    question: "How do I start investing?",
    answer: "To start investing, create an account, verify your identity, connect your wallet, and browse available properties. You can purchase tokens for any property that interests you and start earning passive income through rental yields and potential property appreciation.",
    category: "general"
  },
  {
    id: "faq-3",
    question: "What is the minimum investment?",
    answer: "The minimum investment varies by property but typically starts at $50, making real estate investment accessible to a wider range of investors. Each property listing shows the token price and minimum investment required.",
    category: "investment"
  },
  {
    id: "faq-4",
    question: "How are properties selected for tokenization?",
    answer: "Our team of real estate experts performs extensive due diligence on each property, considering factors like location, condition, rental yield potential, appreciation prospects, and overall market conditions before selecting properties for tokenization.",
    category: "tokenization"
  },
  {
    id: "faq-5",
    question: "How do I earn returns?",
    answer: "Investors earn returns through two primary mechanisms: regular rental income distributions (paid monthly or quarterly based on the property) and potential capital appreciation when property values increase over time.",
    category: "investment"
  },
  {
    id: "faq-6",
    question: "What happens if I want to sell my tokens?",
    answer: "You can sell your tokens on our secondary marketplace, allowing you to exit your investment without waiting for the property to be sold. The liquidity depends on market demand for the specific property tokens.",
    category: "investment"
  },
  {
    id: "faq-7",
    question: "How is the property managed?",
    answer: "Properties are professionally managed by our property management partners. They handle tenant relations, maintenance, rent collection, and other day-to-day operations, allowing investors to enjoy truly passive income.",
    category: "general"
  },
  {
    id: "faq-8",
    question: "What are the fees involved?",
    answer: "EstateToken charges a 2% fee on the initial property tokenization and a 1% management fee annually. There are also small transaction fees when buying or selling tokens on the marketplace. All fees are transparently disclosed for each property.",
    category: "investment"
  },
  {
    id: "faq-9",
    question: "Is my investment legally protected?",
    answer: "Yes, all properties are held by a legal entity (usually an LLC or SPV) in which token holders have proportional ownership rights. These rights are enforced through smart contracts and backed by legal agreements, ensuring your investment is secured.",
    category: "legal"
  },
  {
    id: "faq-10",
    question: "What blockchain technology do you use?",
    answer: "EstateToken operates on the Ethereum blockchain, utilizing ERC-20 tokens for property ownership. We're also exploring integrations with other chains like Polygon and Solana to reduce gas fees and improve transaction efficiency.",
    category: "technical"
  },
  {
    id: "faq-11",
    question: "How do you prevent fraud?",
    answer: "We implement rigorous KYC/AML procedures, conduct thorough property verification, and use multi-signature wallets for fund management. Our smart contracts are audited by independent security firms, and property ownership is verified by legal experts and title insurance.",
    category: "legal"
  },
  {
    id: "faq-12",
    question: "Can I invest from anywhere in the world?",
    answer: "EstateToken is available to investors from most countries. However, due to regulatory constraints, we cannot currently serve residents from sanctioned countries or territories with restrictions on digital asset investments. Please check your local regulations.",
    category: "legal"
  },
  {
    id: "faq-13",
    question: "What happens if EstateToken goes out of business?",
    answer: "Your investment is secured by the underlying property ownership structure and governed by smart contracts on the blockchain. If EstateToken ceases operations, property management would transfer to a backup service provider as outlined in our contingency plan.",
    category: "general"
  },
  {
    id: "faq-14",
    question: "How are property repairs and maintenance handled?",
    answer: "A portion of rental income is allocated to a reserve fund for each property, which covers routine maintenance and unexpected repairs. This ensures the property maintains its value and continues to generate consistent returns for investors.",
    category: "general"
  },
  {
    id: "faq-15",
    question: "What happens if a property doesn't generate expected returns?",
    answer: "While we conduct thorough analysis before tokenizing properties, real estate investments carry inherent risks. If a property underperforms, our management team works to address the issues, which may include changing property managers, renovations, or other strategies to improve performance.",
    category: "investment"
  }
];

const FAQPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFAQs, setFilteredFAQs] = useState(faqData);
  const [activeCategory, setActiveCategory] = useState<FAQCategory | "all">("all");

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);
  }, []);

  const debouncedSearch = useCallback(
    debounce((term: string) => {
      let results = faqData;
      
      // Filter by search term
      if (term) {
        results = results.filter(
          faq => 
            faq.question.toLowerCase().includes(term.toLowerCase()) ||
            faq.answer.toLowerCase().includes(term.toLowerCase())
        );
      }
      
      // Filter by category
      if (activeCategory !== "all") {
        results = results.filter(faq => faq.category === activeCategory);
      }
      
      setFilteredFAQs(results);
    }, 300),
    [activeCategory]
  );

  // Handle search input
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  // Handle category change
  const handleCategoryChange = (category: FAQCategory | "all") => {
    setActiveCategory(category);
    
    let results = faqData;
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(
        faq => 
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (category !== "all") {
      results = results.filter(faq => faq.category === category);
    }
    
    setFilteredFAQs(results);
  };

  return (
    <div className={`min-h-screen transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to the most common questions about EstateToken, property tokenization, and real estate investment.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                className="pl-10 h-12 rounded-full"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
          
          {/* Tabs for Categories */}
          <Tabs defaultValue="all" className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-3 md:grid-cols-6 h-auto p-1">
                <TabsTrigger 
                  value="all" 
                  onClick={() => handleCategoryChange("all")}
                  className="px-4 py-2 rounded-md data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="general" 
                  onClick={() => handleCategoryChange("general")}
                  className="px-4 py-2 rounded-md data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  General
                </TabsTrigger>
                <TabsTrigger 
                  value="tokenization" 
                  onClick={() => handleCategoryChange("tokenization")}
                  className="px-4 py-2 rounded-md data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  Tokenization
                </TabsTrigger>
                <TabsTrigger 
                  value="investment" 
                  onClick={() => handleCategoryChange("investment")}
                  className="px-4 py-2 rounded-md data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  Investment
                </TabsTrigger>
                <TabsTrigger 
                  value="legal" 
                  onClick={() => handleCategoryChange("legal")}
                  className="px-4 py-2 rounded-md data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  Legal
                </TabsTrigger>
                <TabsTrigger 
                  value="technical" 
                  onClick={() => handleCategoryChange("technical")}
                  className="px-4 py-2 rounded-md data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  Technical
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* FAQ Content */}
            <TabsContent value="all" className="mt-0">
              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <h3 className="text-xl font-medium mb-2">No FAQs Found</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any FAQs matching your search.
                  </p>
                  <Link to="/support">
                    <Button>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact Support
                    </Button>
                  </Link>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} className="border-b border-border">
                      <AccordionTrigger className="text-left py-4 text-lg hover:no-underline hover:text-accent">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </TabsContent>
            
            {/* We'll reuse the "all" content for other tabs since we're filtering already */}
            <TabsContent value="general" className="mt-0">
              <div className="content-container" />
            </TabsContent>
            <TabsContent value="tokenization" className="mt-0">
              <div className="content-container" />
            </TabsContent>
            <TabsContent value="investment" className="mt-0">
              <div className="content-container" />
            </TabsContent>
            <TabsContent value="legal" className="mt-0">
              <div className="content-container" />
            </TabsContent>
            <TabsContent value="technical" className="mt-0">
              <div className="content-container" />
            </TabsContent>
          </Tabs>
          
          {/* Call to Action */}
          <div className="max-w-3xl mx-auto mt-12 p-8 bg-card rounded-lg border border-border shadow-sm">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Our support team is ready to help you with any questions or concerns you might have.
              </p>
              <Link to="/support">
                <Button size="lg" className="bg-accent hover:bg-accent/90">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Get Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default FAQPage;
