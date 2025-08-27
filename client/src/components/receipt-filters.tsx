import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Search, RotateCcw, Filter } from "lucide-react";

interface Filters {
  search: string;
  dateFrom: string;
  dateTo: string;
  paymentMethod: string;
  status: string;
  entity: string;
}

interface ReceiptFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

export function ReceiptFilters({ filters, onFiltersChange }: ReceiptFiltersProps) {
  const handleFilterChange = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    onFiltersChange({
      search: "",
      dateFrom: "",
      dateTo: "",
      paymentMethod: "all",
      status: "all",
      entity: "all",
    });
  };

  // Count active filters
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "search") return value.length > 0;
    return value && value !== "all";
  }).length;

  return (
    <div className="flex items-center gap-4">
      {/* Search */}
      <div className="relative flex-1 min-w-64 max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search receipts..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-10"
          data-testid="input-search"
        />
      </div>
      
      {/* Filter Icon with Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative" data-testid="button-filters">
            <Filter className="h-4 w-4" />
            <span className="ml-2">Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 px-1 text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-6" align="end">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filter Options</h4>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleReset}
                data-testid="button-reset-filters"
              >
                <RotateCcw className="mr-2 h-3 w-3" />
                Reset All
              </Button>
            </div>
            
            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  className="flex-1"
                  data-testid="input-date-from"
                />
                <span className="text-muted-foreground text-sm">to</span>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  className="flex-1"
                  data-testid="input-date-to"
                />
              </div>
            </div>
            
            {/* Payment Method Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <Select value={filters.paymentMethod} onValueChange={(value) => handleFilterChange("paymentMethod", value)}>
                <SelectTrigger data-testid="select-payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                  <SelectItem value="recovery">Recovery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger data-testid="select-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending Approval</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Entity Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Entity</label>
              <Select value={filters.entity} onValueChange={(value) => handleFilterChange("entity", value)}>
                <SelectTrigger data-testid="select-entity">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  <SelectItem value="Ali Transport">Ali Transport</SelectItem>
                  <SelectItem value="Khan Industries">Khan Industries</SelectItem>
                  <SelectItem value="City Logistics">City Logistics</SelectItem>
                  <SelectItem value="Express Delivery">Express Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
