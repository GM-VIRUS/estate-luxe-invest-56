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
  type: "Buy" | "Sell" | "Staking" | "Reward";
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

export interface ApiPropertyImage {
  contentType: string;
  key: string;
  path: string;
  url: string;
  _id: string;
  createdAt: string;
  sizeInMegaByte?: number;
}

export interface ApiPropertyImages {
  list: ApiPropertyImage[];
  mainImage: number;
}

export interface ApiPropertyOtherInfo {
  isOccupied: boolean;
  tags: string[];
  pool: boolean;
  fireplace: boolean;
  garage: boolean;
  isTrending: boolean;
  isHidden: boolean;
  description: string;
  _manager: string;
  checkoutDescription: string;
  checkoutHeading: string;
  descriptionHeading: string;
  financedByImage?: ApiPropertyImage;
  financedByName: string;
  firstDividendsDate: string;
  interestRate: number;
  loanTerm: number;
  managedByImage?: ApiPropertyImage;
  managedByName: string;
  occupiedLabel: string;
  purchaseDate: string;
  statusDescription: string;
  title: string;
  _market: string;
  _owner: string;
  descriptionSubHeading: string;
  quote: string;
  estateId: string;
}

export interface ApiProperty {
  _id: string;
  mainImage: ApiPropertyImage;
  images: ApiPropertyImages;
  otherInfo: ApiPropertyOtherInfo;
  city: string;
  state: string;
  country: string;
  description: string;
  pricePerToken: number;
  projectedInvestmentGain: string;
  yearlyReturn: string;
  IRR: string;
  tags: string[];
  tokensSoldPercentage: string;
  numberOfTokens: number;
  tokensSold: number;
  title: string;
  trending: boolean;
  updatedAt: string;
  quote: string;
  latitude: string;
  longitude: string;
  startDate: string;
  stopDate: string;
  minInvestment: number;
  mogulFee: string;
  processingFee: string;
  isSoldOut: boolean;
}

export interface ApiPropertyListResponse {
  status: string;
  data: ApiProperty[];
}

export const convertApiPropertyToProperty = (apiProperty: ApiProperty): Property => {
  return {
    id: apiProperty._id,
    title: apiProperty.title,
    description: apiProperty.description,
    location: `${apiProperty.city}, ${apiProperty.state}`,
    city: apiProperty.city,
    state: apiProperty.state,
    zipCode: "",
    country: apiProperty.country,
    price: apiProperty.minInvestment * apiProperty.numberOfTokens,
    totalValue: apiProperty.minInvestment * apiProperty.numberOfTokens,
    pricePerToken: apiProperty.pricePerToken,
    totalSupply: apiProperty.numberOfTokens,
    availableTokens: apiProperty.numberOfTokens - apiProperty.tokensSold,
    roi: parseFloat(apiProperty.yearlyReturn),
    imageUrl: apiProperty.mainImage?.url || "",
    images: apiProperty.images.list.map(img => img.url),
    featured: apiProperty.trending,
    rentalYield: parseFloat(apiProperty.yearlyReturn),
    appreciationRate: parseFloat(apiProperty.projectedInvestmentGain),
    propertyType: "Residential",
    squareFeet: 0,
    yearBuilt: new Date(apiProperty.startDate).getFullYear(),
    amenities: apiProperty.tags,
    status: apiProperty.isSoldOut ? "Fully Funded" : (apiProperty.tokensSold > 0 ? "Partially Funded" : "Available")
  };
};
