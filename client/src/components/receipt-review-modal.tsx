import { Receipt } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface ReceiptReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receipt: Receipt | null;
  onApprove: () => void;
  onReject: () => void;
  isUpdating: boolean;
}

export function ReceiptReviewModal({
  open,
  onOpenChange,
  receipt,
  onApprove,
  onReject,
  isUpdating,
}: ReceiptReviewModalProps) {
  if (!receipt) return null;

  const formatCurrency = (amount: string) => {
    return `${parseFloat(amount).toLocaleString()} PKR`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-md" data-testid="modal-review">
        <DialogHeader>
          <DialogTitle data-testid="modal-review-title">
            Review Receipt #{receipt.receiptNumber}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground" data-testid="modal-review-description">
            This receipt requires your approval before processing.
          </p>
          
          <div className="bg-muted p-4 rounded-md space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span data-testid="modal-review-amount">{formatCurrency(receipt.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Entity:</span>
              <span data-testid="modal-review-entity">{receipt.entity}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Type:</span>
              <Badge className="ml-2" data-testid="modal-review-type">
                {receipt.paymentMethod.charAt(0).toUpperCase() + receipt.paymentMethod.slice(1)} Payment
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Outstanding:</span>
              <span className="text-orange-600" data-testid="modal-review-outstanding">
                {formatCurrency(receipt.outstandingAmount)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 mt-6">
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700" 
            onClick={onApprove}
            disabled={isUpdating}
            data-testid="button-approve"
          >
            <Check className="mr-2 h-4 w-4" />
            Approve
          </Button>
          <Button 
            className="flex-1 bg-red-600 hover:bg-red-700" 
            onClick={onReject}
            disabled={isUpdating}
            data-testid="button-reject"
          >
            <X className="mr-2 h-4 w-4" />
            Reject
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
