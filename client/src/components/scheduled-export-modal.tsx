import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

interface ScheduledExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduledExportModal({ open, onOpenChange }: ScheduledExportModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    frequency: "daily",
    time: "20:00",
    format: "pdf",
    email: "",
    autoDownload: false,
    isActive: true,
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/schedules", {
        ...data,
        autoDownload: data.autoDownload ? 1 : 0,
        isActive: data.isActive ? 1 : 0,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/schedules"] });
      toast({ title: "Schedule created successfully" });
      onOpenChange(false);
      setFormData({
        frequency: "daily",
        time: "20:00",
        format: "pdf",
        email: "",
        autoDownload: false,
        isActive: true,
      });
    },
    onError: () => {
      toast({ title: "Failed to create schedule", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createScheduleMutation.mutate(formData);
  };

  const handleInputChange = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg" data-testid="modal-schedule">
        <DialogHeader>
          <DialogTitle data-testid="modal-schedule-title">Schedule Export</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="frequency" data-testid="label-frequency">Export Frequency</Label>
            <Select value={formData.frequency} onValueChange={(value) => handleInputChange("frequency", value)}>
              <SelectTrigger data-testid="select-frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="time" data-testid="label-time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              data-testid="input-time"
            />
          </div>
          
          <div>
            <Label htmlFor="format" data-testid="label-format">Format</Label>
            <Select value={formData.format} onValueChange={(value) => handleInputChange("format", value)}>
              <SelectTrigger data-testid="select-format">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="email" data-testid="label-email">Email To (Optional)</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@company.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              data-testid="input-email"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoDownload"
              checked={formData.autoDownload}
              onCheckedChange={(checked) => handleInputChange("autoDownload", checked)}
              data-testid="checkbox-auto-download"
            />
            <Label htmlFor="autoDownload" className="text-sm">
              Auto-download to local folder
            </Label>
          </div>
          
          <div className="flex items-center justify-end gap-3 mt-6">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createScheduleMutation.isPending}
              data-testid="button-save-schedule"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Schedule
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
