
import { PortfolioTransaction, UserPortfolio, PortfolioItem } from "../types/property";
import { properties } from "./propertyData";

// Sample portfolio data - in a real app, this would come from a database
const portfolioItems: PortfolioItem[] = [
  {
    propertyId: "prop-001",
    tokens: 25,
    initialInvestment: 25000,
    currentValuation: 27500,
    purchaseDate: "2023-08-15",
    transactions: [
      {
        id: "tx-001",
        date: "2023-08-15",
        type: "Buy",
        tokens: 20,
        price: 1000,
        total: 20000
      },
      {
        id: "tx-002",
        date: "2023-09-22",
        type: "Buy",
        tokens: 5,
        price: 1000,
        total: 5000
      }
    ]
  },
  {
    propertyId: "prop-003",
    tokens: 15,
    initialInvestment: 30000,
    currentValuation: 33750,
    purchaseDate: "2023-07-10",
    transactions: [
      {
        id: "tx-003",
        date: "2023-07-10",
        type: "Buy",
        tokens: 15,
        price: 2000,
        total: 30000
      }
    ]
  },
  {
    propertyId: "prop-005",
    tokens: 12,
    initialInvestment: 30000,
    currentValuation: 33000,
    purchaseDate: "2023-10-05",
    transactions: [
      {
        id: "tx-004",
        date: "2023-10-05",
        type: "Buy",
        tokens: 12,
        price: 2500,
        total: 30000
      }
    ]
  }
];

export const getUserPortfolio = (): UserPortfolio => {
  const portfolioWithDetails = portfolioItems.map(item => {
    const property = properties.find(p => p.id === item.propertyId);
    if (!property) {
      return item;
    }
    
    // Calculate current valuation based on property's appreciation
    const monthsHeld = getMonthsBetween(new Date(item.purchaseDate), new Date());
    const appreciationMultiplier = 1 + (property.appreciationRate / 100 / 12) * monthsHeld;
    const currentValuation = item.initialInvestment * appreciationMultiplier;
    
    return {
      ...item,
      currentValuation: parseFloat(currentValuation.toFixed(2))
    };
  });
  
  const totalInvestment = portfolioWithDetails.reduce((sum, item) => sum + item.initialInvestment, 0);
  const currentValuation = portfolioWithDetails.reduce((sum, item) => sum + item.currentValuation, 0);
  const overallROI = ((currentValuation - totalInvestment) / totalInvestment) * 100;
  
  return {
    items: portfolioWithDetails,
    totalInvestment,
    currentValuation,
    overallROI
  };
};

export const getPortfolioItemById = (propertyId: string): PortfolioItem | undefined => {
  return portfolioItems.find(item => item.propertyId === propertyId);
};

const getMonthsBetween = (startDate: Date, endDate: Date): number => {
  const months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
  return months + endDate.getMonth() - startDate.getMonth();
};
