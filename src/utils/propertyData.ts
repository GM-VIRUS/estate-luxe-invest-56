
import { Property, PropertyDetails } from "../types/property";

export const properties: Property[] = [
  {
    id: "prop-001",
    title: "Luxury Penthouse",
    description: "Contemporary penthouse with panoramic city views and premium finishes",
    location: "123 Skyline Avenue",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    price: 2500000,
    totalValue: 2500000,
    pricePerToken: 1000,
    totalSupply: 2500,
    availableTokens: 1800,
    roi: 8.5,
    imageUrl: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1439337153520-7082a56a81f4?auto=format&fit=crop&q=80",
    ],
    featured: true,
    rentalYield: 5.2,
    appreciationRate: 3.3,
    propertyType: "Residential",
    squareFeet: 2800,
    bedrooms: 3,
    bathrooms: 3.5,
    yearBuilt: 2020,
    amenities: ["Rooftop Terrace", "Smart Home Technology", "Concierge Service", "Fitness Center"],
    status: "Available"
  },
  {
    id: "prop-002",
    title: "Downtown Loft",
    description: "Industrial-style loft in a converted warehouse with high ceilings and exposed brick",
    location: "456 Urban Street",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    country: "USA",
    price: 1200000,
    totalValue: 1200000,
    pricePerToken: 500,
    totalSupply: 2400,
    availableTokens: 1200,
    roi: 7.2,
    imageUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&q=80",
    ],
    featured: false,
    rentalYield: 4.8,
    appreciationRate: 2.4,
    propertyType: "Residential",
    squareFeet: 1800,
    bedrooms: 2,
    bathrooms: 2,
    yearBuilt: 2015,
    amenities: ["Industrial Design", "Community Rooftop", "Bike Storage", "Pet Friendly"],
    status: "Partially Funded"
  },
  {
    id: "prop-003",
    title: "Oceanfront Villa",
    description: "Luxurious beachfront property with private pool and direct ocean access",
    location: "789 Shoreline Drive",
    city: "Miami",
    state: "FL",
    zipCode: "33139",
    country: "USA",
    price: 4500000,
    totalValue: 4500000,
    pricePerToken: 2000,
    totalSupply: 2250,
    availableTokens: 1500,
    roi: 9.1,
    imageUrl: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&q=80",
    ],
    featured: true,
    rentalYield: 6.5,
    appreciationRate: 4.2,
    propertyType: "Residential",
    squareFeet: 4200,
    bedrooms: 5,
    bathrooms: 5.5,
    yearBuilt: 2018,
    amenities: ["Infinity Pool", "Private Beach Access", "Outdoor Kitchen", "Home Theater"],
    status: "Available"
  },
  {
    id: "prop-004",
    title: "Mountain Retreat",
    description: "Secluded mountain home with panoramic views and modern amenities",
    location: "101 Summit Road",
    city: "Aspen",
    state: "CO",
    zipCode: "81611",
    country: "USA",
    price: 3200000,
    totalValue: 3200000,
    pricePerToken: 1500,
    totalSupply: 2133,
    availableTokens: 900,
    roi: 7.8,
    imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80",
    ],
    featured: false,
    rentalYield: 5.9,
    appreciationRate: 3.8,
    propertyType: "Residential",
    squareFeet: 3500,
    bedrooms: 4,
    bathrooms: 4,
    yearBuilt: 2019,
    amenities: ["Fireplace", "Hot Tub", "Ski-in/Ski-out", "Game Room"],
    status: "Partially Funded"
  },
  {
    id: "prop-005",
    title: "Boutique Office Building",
    description: "Modern office space in a prime downtown location with high-end finishes",
    location: "222 Business Avenue",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    country: "USA",
    price: 5800000,
    totalValue: 5800000,
    pricePerToken: 2500,
    totalSupply: 2320,
    availableTokens: 2000,
    roi: 8.9,
    imageUrl: "https://images.unsplash.com/photo-1439337153520-7082a56a81f4?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1439337153520-7082a56a81f4?auto=format&fit=crop&q=80",
    ],
    featured: true,
    rentalYield: 7.2,
    appreciationRate: 4.5,
    propertyType: "Commercial",
    squareFeet: 12000,
    yearBuilt: 2021,
    amenities: ["Conference Rooms", "Rooftop Lounge", "Bike Storage", "EV Charging"],
    status: "Available"
  },
  {
    id: "prop-006",
    title: "Historic Townhouse",
    description: "Fully renovated townhouse with historic charm and modern luxury",
    location: "333 Heritage Lane",
    city: "Boston",
    state: "MA",
    zipCode: "02108",
    country: "USA",
    price: 1800000,
    totalValue: 1800000,
    pricePerToken: 750,
    totalSupply: 2400,
    availableTokens: 1100,
    roi: 6.8,
    imageUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&q=80",
    ],
    featured: false,
    rentalYield: 4.5,
    appreciationRate: 3.1,
    propertyType: "Residential",
    squareFeet: 2200,
    bedrooms: 3,
    bathrooms: 2.5,
    yearBuilt: 1920,
    amenities: ["Original Hardwood Floors", "Garden Patio", "Smart Home Features", "Wine Cellar"],
    status: "Partially Funded"
  }
];

export const getPropertyDetails = (id: string): PropertyDetails | undefined => {
  const property = properties.find(p => p.id === id);
  
  if (!property) return undefined;

  return {
    ...property,
    priceHistory: [
      { date: "2023-01-01", price: property.price * 0.9 },
      { date: "2023-03-15", price: property.price * 0.92 },
      { date: "2023-06-01", price: property.price * 0.95 },
      { date: "2023-09-15", price: property.price * 0.98 },
      { date: "2023-12-01", price: property.price }
    ],
    ownershipHistory: [
      {
        date: "2022-05-10",
        event: "Property Acquisition",
        description: "Property acquired by EstateChain Fund"
      },
      {
        date: "2022-06-15",
        event: "Tokenization",
        description: "Property tokenized into 2500 shares"
      },
      {
        date: "2022-07-20",
        event: "Initial Offering",
        description: "First round of tokens made available to investors"
      }
    ],
    investmentDetails: {
      minimumInvestment: property.pricePerToken,
      projectedReturns: property.roi,
      holdingPeriod: "3-5 years",
      exitStrategy: "Property sale or token buyback"
    },
    documents: [
      { name: "Property Appraisal", url: "#" },
      { name: "Legal Documentation", url: "#" },
      { name: "Financial Analysis", url: "#" }
    ],
    latitude: 40.7128,
    longitude: -74.0060
  };
};

export const getFeaturedProperties = (): Property[] => {
  return properties.filter(property => property.featured);
};

export const filterProperties = (
  searchTerm: string = "",
  minPrice: number = 0,
  maxPrice: number = Number.MAX_SAFE_INTEGER,
  propertyType: string = "All"
): Property[] => {
  return properties.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.state.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
    
    const matchesType = propertyType === "All" || property.propertyType === propertyType;
    
    return matchesSearch && matchesPrice && matchesType;
  });
};
