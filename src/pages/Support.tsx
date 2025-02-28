
import { useState, useEffect } from "react";
import { User, Mail, Phone, MessageSquare, ChevronRight, AlertTriangle, Send, Check, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

const supportCategories = [
  { id: "account", name: "Account Issues", icon: User },
  { id: "transaction", name: "Transaction Problems", icon: AlertTriangle },
  { id: "technical", name: "Technical Support", icon: MessageSquare },
  { id: "other", name: "Other Inquiries", icon: Mail }
];

// Related FAQs by category
const relatedFAQs = {
  account: [
    { id: "acc-1", question: "How do I reset my password?", answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. We'll send you an email with instructions to create a new password." },
    { id: "acc-2", question: "How do I update my profile information?", answer: "You can update your profile information by logging in and navigating to the 'Account Settings' section. There, you'll find options to edit your personal details and preferences." }
  ],
  transaction: [
    { id: "trans-1", question: "Why did my transaction fail?", answer: "Transactions can fail for various reasons including insufficient funds, network congestion, or wallet connection issues. Check your wallet balance, ensure you have enough for gas fees, and try again." },
    { id: "trans-2", question: "How long do transactions take to process?", answer: "Most transactions are processed within minutes, but during times of high network congestion, they may take longer. You can check the status of your transaction in the 'Transaction History' section." }
  ],
  technical: [
    { id: "tech-1", question: "How do I connect my wallet?", answer: "To connect your wallet, click on the 'Connect Wallet' button in the top right corner of the page. Select your wallet provider (MetaMask, WalletConnect, etc.) and follow the prompts to complete the connection." },
    { id: "tech-2", question: "Which browsers are supported?", answer: "We officially support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using Chrome with the MetaMask extension installed." }
  ],
  other: [
    { id: "other-1", question: "How can I become a partner?", answer: "We're always looking for partnerships with real estate developers, property managers, and technology providers. Please submit your proposal through our support system with the category 'Partnership Inquiry'." },
    { id: "other-2", question: "Do you offer investment consultation?", answer: "While we provide educational resources about real estate tokenization, we don't offer personalized investment advice. We recommend consulting with a financial advisor for guidance tailored to your situation." }
  ]
};

const SupportPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  
  // Form data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [urgency, setUrgency] = useState("medium");
  const [preferredContact, setPreferredContact] = useState("email");

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);
  }, []);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Animate scroll to next section
    setTimeout(() => {
      document.getElementById("faq-suggestions")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const proceedToForm = () => {
    setFormStep(2);
    // Animate scroll to form
    setTimeout(() => {
      document.getElementById("support-form")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !issueDescription) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setTicketSubmitted(true);
      toast.success("Your support ticket has been submitted successfully!");
      
      // Scroll to confirmation
      setTimeout(() => {
        document.getElementById("submission-confirmation")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, 1500);
  };

  const getFAQsForCategory = () => {
    if (!selectedCategory) return [];
    return relatedFAQs[selectedCategory as keyof typeof relatedFAQs] || [];
  };

  return (
    <div className={`min-h-screen transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Help & Support</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get assistance with your account, transactions, or technical issues. Our team is here to help you succeed with your real estate investments.
            </p>
          </div>
          
          {/* Category Selection */}
          <div className="max-w-4xl mx-auto mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">What do you need help with?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {supportCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`p-6 rounded-lg border transition-all duration-300 hover:border-accent hover:shadow-md ${
                      selectedCategory === category.id 
                        ? "border-accent bg-accent/5 shadow-md" 
                        : "border-border"
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-3 rounded-full mb-3 ${
                        selectedCategory === category.id 
                          ? "bg-accent/10 text-accent" 
                          : "bg-muted text-muted-foreground"
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-medium">{category.name}</h3>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* FAQ Suggestions */}
          {selectedCategory && (
            <div id="faq-suggestions" className="max-w-4xl mx-auto mb-16 animate-fade-in">
              <h2 className="text-2xl font-bold mb-6">Related FAQs</h2>
              <p className="text-muted-foreground mb-6">
                These frequently asked questions might help resolve your issue quickly:
              </p>
              
              <Accordion type="single" collapsible className="w-full mb-8">
                {getFAQsForCategory().map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id} className="border-b border-border">
                    <AccordionTrigger className="text-left py-4 hover:no-underline hover:text-accent">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <div className="text-center">
                <p className="mb-4 text-lg">Didn't find what you were looking for?</p>
                <Button 
                  onClick={proceedToForm} 
                  className="bg-accent hover:bg-accent/90"
                  size="lg"
                >
                  Submit a Support Ticket <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Support Form */}
          {formStep === 2 && !ticketSubmitted && (
            <div id="support-form" className="max-w-2xl mx-auto animate-fade-in">
              <div className="bg-card rounded-lg shadow-sm border border-border p-8">
                <h2 className="text-2xl font-bold mb-6">Submit a Support Ticket</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative mt-1">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone number (optional)"
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="category">Issue Category <span className="text-destructive">*</span></Label>
                      <Select
                        defaultValue={selectedCategory || undefined}
                        onValueChange={value => setSelectedCategory(value)}
                        required
                      >
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {supportCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Describe Your Issue <span className="text-destructive">*</span></Label>
                      <Textarea
                        id="description"
                        value={issueDescription}
                        onChange={(e) => setIssueDescription(e.target.value)}
                        placeholder="Please provide details about your issue..."
                        className="mt-1 min-h-[120px]"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label>Issue Urgency</Label>
                      <RadioGroup
                        value={urgency}
                        onValueChange={setUrgency}
                        className="flex space-x-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="low" id="urgency-low" />
                          <Label htmlFor="urgency-low" className="font-normal">Low</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="urgency-medium" />
                          <Label htmlFor="urgency-medium" className="font-normal">Medium</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="high" id="urgency-high" />
                          <Label htmlFor="urgency-high" className="font-normal">High</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label>Preferred Contact Method</Label>
                      <RadioGroup
                        value={preferredContact}
                        onValueChange={setPreferredContact}
                        className="flex space-x-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="email" id="contact-email" />
                          <Label htmlFor="contact-email" className="font-normal">Email</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="phone" id="contact-phone" />
                          <Label htmlFor="contact-phone" className="font-normal">Phone</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 h-11"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Processing...
                      </>
                    ) : (
                      <>
                        Submit Ticket <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          )}
          
          {/* Submission Confirmation */}
          {ticketSubmitted && (
            <div id="submission-confirmation" className="max-w-2xl mx-auto animate-fade-in">
              <div className="bg-card rounded-lg shadow-sm border border-border p-8 text-center">
                <div className="bg-green-500/10 text-green-500 h-16 w-16 rounded-full mx-auto flex items-center justify-center mb-6">
                  <Check className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Support Ticket Submitted</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for reaching out! Your ticket number is <span className="font-mono bg-muted px-2 py-1 rounded">#{Math.floor(Math.random() * 100000).toString().padStart(6, '0')}</span>
                </p>
                <div className="space-y-4 mb-8">
                  <p>We'll respond to your inquiry within 24 hours via {preferredContact === "email" ? "email" : "phone"}.</p>
                  <p>You'll receive a confirmation email with details of your support request at <span className="font-medium">{email}</span>.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/">
                    <Button variant="outline">
                      Return to Home
                    </Button>
                  </Link>
                  <Link to="/faq">
                    <Button className="bg-accent hover:bg-accent/90">
                      Browse FAQ
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SupportPage;
