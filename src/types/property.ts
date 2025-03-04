
export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  price: number;
  totalValue: number;
  pricePerToken: number;
  totalSupply: number;
  availableTokens: number;
  roi: number;
  imageUrl: string;
  images: string[];
  featured: boolean;
  rentalYield: number;
  appreciationRate: number;
  propertyType: "Residential" | "Commercial" | "Industrial" | "Land";
  squareFeet: number;
  bedrooms?: number;
  bathrooms?: number;
  yearBuilt: number;
  amenities: string[];
  status: "Available" | "Partially Funded" | "Fully Funded";
}

export interface PriceHistory {
  date: string;
  price: number;
}

export interface PropertyDetails extends Property {
  priceHistory: PriceHistory[];
  ownershipHistory: {
    date: string;
    event: string;
    description: string;
  }[];
  investmentDetails: {
    minimumInvestment: number;
    projectedReturns: number;
    holdingPeriod: string;
    exitStrategy: string;
  };
  documents: {
    name: string;
    url: string;
  }[];
  latitude: number;
  longitude: number;
}

// Portfolio-related types
export interface PortfolioItem {
  propertyId: string;
  tokens: number;
  initialInvestment: number;
  currentValuation: number;
  purchaseDate: string;
  transactions: PortfolioTransaction[];
}

export interface PortfolioTransaction {
  id: string;
  date: string;
  type: "Buy" | "Sell";
  tokens: number;
  price: number;
  total: number;
}

export interface UserPortfolio {
  items: PortfolioItem[];
  totalInvestment: number;
  currentValuation: number;
  overallROI: number;
}
