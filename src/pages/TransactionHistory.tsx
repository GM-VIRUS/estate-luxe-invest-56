import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PortfolioTransaction } from "@/types/property";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { getUserTransactions } from "@/utils/portfolioData";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowDown, 
  ArrowDownRight, 
  ArrowLeft, 
  ArrowUpRight, 
  Calendar as CalendarIcon, 
  Download, 
  FileText, 
  Filter,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";
import TransactionFilter from "@/components/transactions/TransactionFilter";
import { toast } from "@/hooks/use-toast";

// Transaction types allowed in the system
const TRANSACTION_TYPES = ["Buy", "Sell", "Staking", "Reward"] as const;
type TransactionType = typeof TRANSACTION_TYPES[number];

// Extending the PortfolioTransaction type to include new fields
interface ExtendedTransaction extends PortfolioTransaction {
  type: TransactionType;
  hash: string;
  status: "Completed" | "Pending" | "Failed";
  timestamp: Date;
}

const TransactionHistory = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<ExtendedTransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<ExtendedTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    dateRange: "all" as "7days" | "30days" | "custom" | "all",
    types: TRANSACTION_TYPES.map(type => ({ type, checked: true })),
    startDate: null as Date | null,
    endDate: null as Date | null,
  });
  
  useEffect(() => {
    // Simulate fetch with delay
    const fetchData = async () => {
      setIsLoading(true);
      // Get basic transaction data and extend it
      const rawTransactions = await getUserTransactions();
      
      // Transform to extended transactions
      const extendedTransactions: ExtendedTransaction[] = rawTransactions.map(tx => {
        // Generate mock hash
        const hash = `0x${Array.from({length: 40}, () => 
          Math.floor(Math.random() * 16).toString(16)).join('')}`;
        
        return {
          ...tx,
          hash,
          status: "Completed" as const,
          timestamp: new Date(tx.date),
          // If the original type doesn't match our allowed types, default to "Buy"
          type: TRANSACTION_TYPES.includes(tx.type as TransactionType) 
            ? tx.type as TransactionType 
            : "Buy"
        };
      });
      
      setTransactions(extendedTransactions);
      setFilteredTransactions(extendedTransactions);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);
  
  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [activeFilters, transactions]);
  
  const applyFilters = () => {
    let filtered = [...transactions];
    
    // Filter by transaction type
    const selectedTypes = activeFilters.types
      .filter(t => t.checked)
      .map(t => t.type);
    
    filtered = filtered.filter(tx => selectedTypes.includes(tx.type));
    
    // Filter by date range
    if (activeFilters.dateRange === "7days") {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      filtered = filtered.filter(tx => tx.timestamp >= cutoff);
    } else if (activeFilters.dateRange === "30days") {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      filtered = filtered.filter(tx => tx.timestamp >= cutoff);
    } else if (activeFilters.dateRange === "custom" && activeFilters.startDate) {
      if (activeFilters.endDate) {
        filtered = filtered.filter(tx => 
          tx.timestamp >= activeFilters.startDate! && 
          tx.timestamp <= activeFilters.endDate!
        );
      } else {
        filtered = filtered.filter(tx => tx.timestamp >= activeFilters.startDate!);
      }
    }
    
    setFilteredTransactions(filtered);
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refresh with delay
    setTimeout(() => {
      // In a real app, we'd refetch the data here
      setIsRefreshing(false);
    }, 1000);
  };
  
  const handleExport = (format: "csv" | "pdf") => {
    // In a real app, we'd generate and download the file
    console.log(`Exporting transactions in ${format} format`);
    
    // For demonstration, show a toast notification
    toast({
      title: "Export initiated",
      description: `Your transaction history is being exported as ${format.toUpperCase()}`,
    });
    
    // Mock download by creating a dummy file
    if (format === "csv") {
      // Create CSV content
      const csvContent = "data:text/csv;charset=utf-8," + 
        "Date,Type,Amount,Hash,Status\n" +
        filteredTransactions.map(tx => 
          `${format(tx.timestamp, "yyyy-MM-dd HH:mm:ss")},${tx.type},${tx.total},${tx.hash},${tx.status}`
        ).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "transaction_history.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For PDF, we'd typically use a library like jsPDF
      // This is just a placeholder
      toast({
        title: "PDF Export",
        description: "PDF export would be implemented with a library like jsPDF",
      });
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-500";
      case "Pending":
        return "text-amber-500";
      case "Failed":
        return "text-red-500";
      default:
        return "";
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Buy":
        return <ArrowDownRight className="h-4 w-4 mr-1 text-green-500" />;
      case "Sell":
        return <ArrowUpRight className="h-4 w-4 mr-1 text-red-500" />;
      case "Staking":
        return <ArrowDown className="h-4 w-4 mr-1 text-blue-500" />;
      case "Reward":
        return <ArrowDown className="h-4 w-4 mr-1 text-amber-500" />;
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold animate-pulse bg-gray-200 rounded h-10 w-56"></h1>
          <div className="animate-pulse bg-gray-200 rounded h-10 w-24"></div>
        </div>
        
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border rounded-xl bg-gray-100 animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-6">
        <Link to="/portfolio">
          <Button variant="ghost" className="pl-0 group transition-all duration-300 hover:translate-x-[-5px]">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            Back to Portfolio
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Transaction History</h1>
          <p className="text-muted-foreground">
            View and manage all your investment transactions
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className={filterOpen ? "bg-accent text-accent-foreground" : ""}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFilters.dateRange !== "all" || 
                 activeFilters.types.some(t => !t.checked) ? (
                  <span className="ml-1 px-1.5 py-0.5 bg-accent text-xs font-medium rounded-full">
                    Active
                  </span>
                ) : null}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <TransactionFilter 
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                transactionTypes={TRANSACTION_TYPES}
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Updating..." : "Refresh"}
          </Button>
          
          <Select onValueChange={(value) => handleExport(value as "csv" | "pdf")}>
            <SelectTrigger className="w-[140px]" size="sm">
              <SelectValue placeholder="Export" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Export As</SelectLabel>
                <SelectItem value="csv">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    CSV
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Transactions</CardTitle>
          <CardDescription>
            Showing {filteredTransactions.length} of {transactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Tokens</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Transaction Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No transactions found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction, index) => (
                    <TableRow 
                      key={transaction.id} 
                      className="animate-fade-in hover:bg-accent/5 transition-colors"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <TableCell>
                        <div className="font-medium">
                          {format(transaction.timestamp, "MMM d, yyyy")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(transaction.timestamp, "h:mm a")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getTypeIcon(transaction.type)}
                          <span>{transaction.type}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(transaction.total)}
                      </TableCell>
                      <TableCell>
                        {transaction.tokens} tokens
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transaction.status === "Completed" ? "bg-green-100 text-green-800" :
                          transaction.status === "Pending" ? "bg-amber-100 text-amber-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {transaction.status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-mono truncate max-w-[120px]">
                            {transaction.hash}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full hover:bg-accent/10"
                            onClick={() => {
                              navigator.clipboard.writeText(transaction.hash);
                              toast({
                                description: "Transaction hash copied to clipboard",
                              });
                            }}
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="12" 
                              height="12" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            <span className="sr-only">Copy hash</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionHistory;
