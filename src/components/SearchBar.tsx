
import { useState } from "react";
import { Search, MapPin, DollarSign, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState("Any");
  const [propertyType, setPropertyType] = useState("All");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search submit
    console.log({
      searchTerm,
      priceRange,
      propertyType
    });
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-2 md:p-3 shadow-lg glass-input"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-white/70" />
          </div>
          <input
            type="text"
            placeholder="Location or property name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-white placeholder-white/60"
          />
        </div>

        <div className="relative md:w-48">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-white/70" />
          </div>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-white appearance-none cursor-pointer"
          >
            <option value="Any" className="bg-gray-800">Any Price</option>
            <option value="0-1000000" className="bg-gray-800">Under $1M</option>
            <option value="1000000-2000000" className="bg-gray-800">$1M - $2M</option>
            <option value="2000000-5000000" className="bg-gray-800">$2M - $5M</option>
            <option value="5000000+" className="bg-gray-800">$5M+</option>
          </select>
        </div>

        <div className="relative md:w-48">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Building className="h-5 w-5 text-white/70" />
          </div>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-white appearance-none cursor-pointer"
          >
            <option value="All" className="bg-gray-800">All Types</option>
            <option value="Residential" className="bg-gray-800">Residential</option>
            <option value="Commercial" className="bg-gray-800">Commercial</option>
            <option value="Industrial" className="bg-gray-800">Industrial</option>
            <option value="Land" className="bg-gray-800">Land</option>
          </select>
        </div>

        <Button type="submit" className="md:w-auto bg-accent hover:bg-accent/90 text-white rounded-full px-6">
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
