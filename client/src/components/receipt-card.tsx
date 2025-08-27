import { Receipt } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building, User, MapPin, Share, Printer, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReceiptCardProps {
  receipt: Receipt;
  onReview: (receipt: Receipt) => void;
  onShare: (receipt: Receipt) => void;
  onPrint: (receipt: Receipt) => void;
}

export function ReceiptCard({ receipt, onReview, onShare, onPrint }: ReceiptCardProps) {
  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case "cash":
        return "payment-method-cash";
      case "credit":
        return "payment-method-credit";
      case "recovery":
        return "payment-method-recovery";
      default:
        return "payment-method-cash";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "status-completed";
      case "pending":
        return "status-pending";
      case "overdue":
        return "status-overdue";
      default:
        return "status-completed";
    }
  };

  const formatCurrency = (amount: string | null) => {
    const numericAmount = amount ? parseFloat(amount) : 0;
    return `${numericAmount.toLocaleString()} PKR`;
  };

  const formatDateTime = (datetime: Date | string) => {
    const date = new Date(datetime);
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Card className="receipt-card shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1" data-testid={`card-receipt-${receipt.id}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-lg font-semibold text-foreground" data-testid={`text-receipt-number-${receipt.id}`}>
              #{receipt.receiptNumber}
            </div>
            <div className="text-sm text-muted-foreground" data-testid={`text-datetime-${receipt.id}`}>
              {formatDateTime(receipt.datetime)}
            </div>
          </div>
          <Badge className={cn("px-2 py-1 text-xs font-medium", getStatusColor(receipt.status))} data-testid={`badge-status-${receipt.id}`}>
            {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
          </Badge>
        </div>

        {/* Entity Information */}
        <div className="mb-4 space-y-1">
          <div className="flex items-center text-sm">
            <Building className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Entity:</span>
            <span className="ml-1" data-testid={`text-entity-${receipt.id}`}>
              {receipt.entity} {receipt.vehicle && `(Vehicle ${receipt.vehicle})`}
            </span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <User className="mr-2 h-4 w-4" />
            <span data-testid={`text-staff-${receipt.id}`}>{receipt.staff}</span>
            <span className="mx-2">|</span>
            <MapPin className="mr-1 h-3 w-3" />
            <span data-testid={`text-branch-${receipt.id}`}>{receipt.branch}</span>
          </div>
        </div>

        {/* Payment Details */}
        <div className="border-t border-border pt-4 mb-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center text-sm">
              <span>Payment Method:</span>
            </span>
            <Badge className={cn("px-2 py-1 text-xs font-medium", getPaymentMethodColor(receipt.paymentMethod))} data-testid={`badge-payment-method-${receipt.id}`}>
              {receipt.paymentMethod.charAt(0).toUpperCase() + receipt.paymentMethod.slice(1)}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Credit Used:</span>
              <span className="font-medium" data-testid={`text-credit-${receipt.id}`}>
                {formatCurrency(receipt.creditAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recovery:</span>
              <span className="font-medium text-green-600" data-testid={`text-recovery-${receipt.id}`}>
                {formatCurrency(receipt.recoveryAmount)}
              </span>
            </div>
            <div className="flex justify-between font-semibold border-t border-border pt-2">
              <span>Total:</span>
              <span className="text-lg" data-testid={`text-total-${receipt.id}`}>
                {formatCurrency(receipt.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={cn(
                parseFloat(receipt.outstandingAmount || "0") > 0 ? "text-orange-600" : "text-green-600"
              )}>Outstanding:</span>
              <span className={cn(
                "font-medium",
                parseFloat(receipt.outstandingAmount || "0") > 0 ? "text-orange-600" : "text-green-600"
              )} data-testid={`text-outstanding-${receipt.id}`}>
                {formatCurrency(receipt.outstandingAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-green-600 hover:bg-green-700" 
            onClick={() => onShare(receipt)}
            data-testid={`button-share-${receipt.id}`}
          >
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button 
            size="sm" 
            className="flex-1 bg-blue-600 hover:bg-blue-700" 
            onClick={() => onPrint(receipt)}
            data-testid={`button-print-${receipt.id}`}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button 
            size="sm" 
            className={cn(
              "flex-1",
              receipt.status === "overdue" 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-orange-600 hover:bg-orange-700"
            )}
            onClick={() => onReview(receipt)}
            data-testid={`button-review-${receipt.id}`}
          >
            <Eye className="mr-2 h-4 w-4" />
            Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
