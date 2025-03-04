
import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

interface FilterState {
  dateRange: "7days" | "30days" | "custom" | "all";
  types: { type: string; checked: boolean }[];
  startDate: Date | null;
  endDate: Date | null;
}

interface TransactionFilterProps {
  activeFilters: FilterState;
  setActiveFilters: Dispatch<SetStateAction<FilterState>>;
  transactionTypes: readonly string[];
}

const TransactionFilter = ({ 
  activeFilters, 
  setActiveFilters,
  transactionTypes
}: TransactionFilterProps) => {
  const handleDateRangeChange = (value: "7days" | "30days" | "custom" | "all") => {
    setActiveFilters(prev => ({
      ...prev,
      dateRange: value,
      // Reset custom dates if not using custom range
      ...(value !== "custom" ? { startDate: null, endDate: null } : {})
    }));
  };
  
  const handleTypeToggle = (type: string) => {
    setActiveFilters(prev => ({
      ...prev,
      types: prev.types.map(t => 
        t.type === type ? { ...t, checked: !t.checked } : t
      )
    }));
  };
  
  const handleResetFilters = () => {
    setActiveFilters({
      dateRange: "all",
      types: transactionTypes.map(type => ({ type, checked: true })),
      startDate: null,
      endDate: null,
    });
  };
  
  const isFiltered = 
    activeFilters.dateRange !== "all" || 
    activeFilters.types.some(t => !t.checked);
  
  return (
    <div className="p-4 w-[340px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Filter Transactions</h3>
        {isFiltered && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleResetFilters}
            className="h-8 px-2 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Reset
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Time Period</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={activeFilters.dateRange === "7days" ? "default" : "outline"}
              size="sm"
              onClick={() => handleDateRangeChange("7days")}
              className="justify-start"
            >
              Last 7 Days
            </Button>
            <Button
              variant={activeFilters.dateRange === "30days" ? "default" : "outline"}
              size="sm"
              onClick={() => handleDateRangeChange("30days")}
              className="justify-start"
            >
              Last 30 Days
            </Button>
            <Button
              variant={activeFilters.dateRange === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => handleDateRangeChange("all")}
              className="justify-start"
            >
              All Time
            </Button>
            <Button
              variant={activeFilters.dateRange === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => handleDateRangeChange("custom")}
              className="justify-start"
            >
              Custom Range
            </Button>
          </div>
        </div>
        
        {activeFilters.dateRange === "custom" && (
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="justify-start">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {activeFilters.startDate ? (
                    format(activeFilters.startDate, "LLL dd, y")
                  ) : (
                    "Start Date"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={activeFilters.startDate || undefined}
                  onSelect={(date) => {
                    setActiveFilters(prev => ({ ...prev, startDate: date }));
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="justify-start">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {activeFilters.endDate ? (
                    format(activeFilters.endDate, "LLL dd, y")
                  ) : (
                    "End Date"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={activeFilters.endDate || undefined}
                  onSelect={(date) => {
                    setActiveFilters(prev => ({ ...prev, endDate: date }));
                  }}
                  disabled={date => !activeFilters.startDate || date < activeFilters.startDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
        
        <Separator />
        
        <div>
          <h4 className="text-sm font-medium mb-2">Transaction Type</h4>
          <div className="space-y-2">
            {activeFilters.types.map((item) => (
              <div key={item.type} className="flex items-center">
                <Checkbox
                  id={`filter-${item.type}`}
                  checked={item.checked}
                  onCheckedChange={() => handleTypeToggle(item.type)}
                  className="mr-2 data-[state=checked]:bg-accent data-[state=checked]:text-white"
                />
                <label
                  htmlFor={`filter-${item.type}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item.type}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilter;
