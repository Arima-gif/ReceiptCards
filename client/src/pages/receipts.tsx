import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Receipt } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Sidebar } from "@/components/sidebar";
import { ReceiptFilters } from "@/components/receipt-filters";
import { ReceiptCard } from "@/components/receipt-card";
import { ReceiptReviewModal } from "@/components/receipt-review-modal";
import { ScheduledExportModal } from "@/components/scheduled-export-modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Download } from "lucide-react";

interface Filters {
  search: string;
  dateFrom: string;
  dateTo: string;
  paymentMethod: string;
  status: string;
  entity: string;
}

export default function ReceiptsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [filters, setFilters] = useState<Filters>({
    search: "",
    dateFrom: "",
    dateTo: "",
    paymentMethod: "all",
    status: "all",
    entity: "all",
  });
  
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const { data: receipts = [], isLoading } = useQuery<Receipt[]>({
    queryKey: ["/api/receipts", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all") {
          params.append(key, value);
        }
      });
      
      const response = await fetch(`/api/receipts?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch receipts");
      return response.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/receipts/${id}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/receipts"] });
      toast({ title: "Receipt status updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update receipt status", variant: "destructive" });
    },
  });

  const exportMutation = useMutation({
    mutationFn: async ({ format, filters }: { format: string; filters: Filters }) => {
      const response = await apiRequest("POST", "/api/receipts/export", { format, filters });
      return response.json();
    },
    onSuccess: (data) => {
      toast({ title: `Export completed: ${data.count} receipts exported` });
    },
    onError: () => {
      toast({ title: "Export failed", variant: "destructive" });
    },
  });

  const handleReviewReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setShowReviewModal(true);
  };

  const handleApproveReceipt = () => {
    if (selectedReceipt) {
      updateStatusMutation.mutate({ id: selectedReceipt.id, status: "completed" });
      setShowReviewModal(false);
    }
  };

  const handleRejectReceipt = () => {
    if (selectedReceipt) {
      updateStatusMutation.mutate({ id: selectedReceipt.id, status: "overdue" });
      setShowReviewModal(false);
    }
  };

  const handleBulkExport = () => {
    exportMutation.mutate({ format: "pdf", filters });
  };

  const handleShareWhatsApp = (receipt: Receipt) => {
    const message = `Receipt #${receipt.receiptNumber}\nEntity: ${receipt.entity}\nAmount: ${receipt.totalAmount} PKR\nStatus: ${receipt.status}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, "_blank");
  };

  const handlePrintReceipt = (receipt: Receipt) => {
    // In a real implementation, this would trigger a print dialog or PDF generation
    toast({ title: `Printing receipt #${receipt.receiptNumber}` });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header and Filters */}
        <div className="bg-card border-b border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold" data-testid="page-title">Receipt Management</h2>
            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setShowScheduleModal(true)}
                data-testid="button-schedule-export"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Export
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleBulkExport}
                disabled={exportMutation.isPending}
                data-testid="button-bulk-export"
              >
                <Download className="mr-2 h-4 w-4" />
                Bulk Export
              </Button>
            </div>
          </div>
          
          <ReceiptFilters filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Receipts Grid */}
        <div className="flex-1 p-6 overflow-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-card rounded-lg animate-pulse" />
              ))}
            </div>
          ) : receipts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground" data-testid="text-no-receipts">No receipts found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {receipts.map((receipt) => (
                <ReceiptCard
                  key={receipt.id}
                  receipt={receipt}
                  onReview={handleReviewReceipt}
                  onShare={handleShareWhatsApp}
                  onPrint={handlePrintReceipt}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {receipts.length > 0 && (
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-border">
              <div className="text-sm text-muted-foreground" data-testid="text-pagination-info">
                Showing {receipts.length} receipts
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" data-testid="button-previous">Previous</Button>
                <Button size="sm" data-testid="button-page-1">1</Button>
                <Button variant="outline" size="sm" data-testid="button-next">Next</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ReceiptReviewModal
        open={showReviewModal}
        onOpenChange={setShowReviewModal}
        receipt={selectedReceipt}
        onApprove={handleApproveReceipt}
        onReject={handleRejectReceipt}
        isUpdating={updateStatusMutation.isPending}
      />
      
      <ScheduledExportModal
        open={showScheduleModal}
        onOpenChange={setShowScheduleModal}
      />
    </div>
  );
}
