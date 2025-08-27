import { Receipt } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, X, MessageCircle, Camera } from "lucide-react";

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

  const formatCurrency = (amount: string | null) => {
    const numericAmount = amount ? parseFloat(amount) : 0;
    return `${numericAmount.toLocaleString()} PKR`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[80vh]" data-testid="modal-review">
        <DialogHeader>
          <DialogTitle data-testid="modal-review-title">
            Review Receipt #{receipt.receiptNumber}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 pr-4">
            {/* Receipt Details */}
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

            {/* Salesman Information */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Salesman Details
              </h4>
              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={receipt.salesmanPhoto || undefined} alt={receipt.salesmanName} />
                    <AvatarFallback>
                      {receipt.salesmanName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium" data-testid="modal-review-salesman-name">
                      {receipt.salesmanName}
                    </p>
                    <p className="text-sm text-muted-foreground">Sales Representative</p>
                  </div>
                </div>
                {receipt.salesmanMessage && (
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-sm" data-testid="modal-review-salesman-message">
                      "{receipt.salesmanMessage}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Receipt Photos */}
            {receipt.receiptPhotos && receipt.receiptPhotos.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Receipt Photos ({receipt.receiptPhotos.length})
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {receipt.receiptPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Receipt photo ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                        data-testid={`img-receipt-photo-${index}`}
                        onClick={() => window.open(photo, '_blank')}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 text-xs bg-black/50 px-2 py-1 rounded">
                          Click to view full size
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="flex items-center gap-3 mt-6 pt-4 border-t">
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
