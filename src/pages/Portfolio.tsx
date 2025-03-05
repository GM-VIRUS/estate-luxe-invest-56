
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw, Search } from "lucide-react";
import PortfolioCard from "@/components/portfolio/PortfolioCard";
import PortfolioSummary from "@/components/portfolio/PortfolioSummary";
import BackButton from "@/components/ui/back-button";
import SectionHeading from "@/components/ui/section-heading";
import { usePortfolio } from "@/hooks/usePropertyData";

const Portfolio = () => {
  const {
    portfolio,
    loading,
    refreshing,
    sortBy,
    setSortBy,
    handleRefresh,
    getPropertyDetails,
    getSortedItems
  } = usePortfolio();

  const renderFilterButtons = () => (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Properties</DialogTitle>
            <DialogDescription>
              Filter and sort your portfolio properties.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Tabs defaultValue="sort" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sort">Sort</TabsTrigger>
                <TabsTrigger value="filter">Filter</TabsTrigger>
              </TabsList>
              <TabsContent value="sort">
                <div className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 gap-2">
                    <label className="text-sm font-medium">Sort By</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button 
                        variant={sortBy === "value" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("value")}
                      >
                        Value
                      </Button>
                      <Button 
                        variant={sortBy === "roi" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("roi")}
                      >
                        ROI
                      </Button>
                      <Button 
                        variant={sortBy === "date" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy("date")}
                      >
                        <Clock className="h-4 w-4 mr-1" /> Date
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="filter">
                <div className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">
                    Additional filters coming soon.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
      
      <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={refreshing}>
        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
        {refreshing ? "Updating..." : "Refresh"}
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold animate-pulse bg-gray-200 rounded h-10 w-56"></h1>
          <div className="animate-pulse bg-gray-200 rounded h-10 w-24"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card rounded-xl p-5 border shadow-sm space-y-4 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
        
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 border rounded-xl bg-gray-100 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">No portfolio data available</h2>
        <p className="text-muted-foreground mb-6">You haven't made any investments yet.</p>
        <Button asChild>
          <a href="/properties">Browse Properties</a>
        </Button>
      </div>
    );
  }

  const sortedItems = getSortedItems(portfolio.items);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-6">
        <BackButton to="/" label="Back to Home" />
      </div>
      
      <SectionHeading
        title="My Portfolio"
        description="Manage your real estate investments and track performance"
        rightElement={renderFilterButtons()}
      />
      
      <PortfolioSummary portfolio={portfolio} />
      
      <div className="space-y-6">
        {sortedItems.map((item) => {
          const property = getPropertyDetails(item.propertyId);
          if (!property) return null;
          
          return (
            <PortfolioCard 
              key={item.propertyId} 
              item={item}
              property={property}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Portfolio;
