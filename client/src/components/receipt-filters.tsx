import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";

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

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {/* Search */}
      <div className="relative min-w-64">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search receipts..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="pl-10"
          data-testid="input-search"
        />
      </div>
      
      {/* Date Range */}
      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
          className="w-auto"
          data-testid="input-date-from"
        />
        <span className="text-muted-foreground text-sm">to</span>
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(e) => handleFilterChange("dateTo", e.target.value)}
          className="w-auto"
          data-testid="input-date-to"
        />
      </div>
      
      {/* Payment Method Filter */}
      <Select value={filters.paymentMethod} onValueChange={(value) => handleFilterChange("paymentMethod", value)}>
        <SelectTrigger className="w-48" data-testid="select-payment-method">
          <SelectValue placeholder="Payment Method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Payment Methods</SelectItem>
          <SelectItem value="cash">Cash</SelectItem>
          <SelectItem value="credit">Credit</SelectItem>
          <SelectItem value="recovery">Recovery</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Status Filter */}
      <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
        <SelectTrigger className="w-40" data-testid="select-status">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="pending">Pending Approval</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Entity Filter */}
      <Select value={filters.entity} onValueChange={(value) => handleFilterChange("entity", value)}>
        <SelectTrigger className="w-40" data-testid="select-entity">
          <SelectValue placeholder="Entity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Entities</SelectItem>
          <SelectItem value="Ali Transport">Ali Transport</SelectItem>
          <SelectItem value="Khan Industries">Khan Industries</SelectItem>
          <SelectItem value="City Logistics">City Logistics</SelectItem>
          <SelectItem value="Express Delivery">Express Delivery</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Reset Button */}
      <Button 
        variant="ghost" 
        onClick={handleReset}
        data-testid="button-reset-filters"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset
      </Button>
    </div>
  );
}
