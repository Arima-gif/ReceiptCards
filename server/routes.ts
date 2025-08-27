import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReceiptSchema, insertScheduleSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all receipts with optional filters
  app.get("/api/receipts", async (req, res) => {
    try {
      const filters = {
        search: req.query.search as string,
        dateFrom: req.query.dateFrom as string,
        dateTo: req.query.dateTo as string,
        paymentMethod: req.query.paymentMethod as string,
        status: req.query.status as string,
        entity: req.query.entity as string,
      };
      
      const receipts = await storage.getReceipts(filters);
      res.json(receipts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch receipts" });
    }
  });

  // Get receipt by ID
  app.get("/api/receipts/:id", async (req, res) => {
    try {
      const receipt = await storage.getReceiptById(req.params.id);
      if (!receipt) {
        return res.status(404).json({ message: "Receipt not found" });
      }
      res.json(receipt);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch receipt" });
    }
  });

  // Create new receipt
  app.post("/api/receipts", async (req, res) => {
    try {
      const validatedData = insertReceiptSchema.parse(req.body);
      const receipt = await storage.createReceipt(validatedData);
      res.status(201).json(receipt);
    } catch (error) {
      res.status(400).json({ message: "Invalid receipt data" });
    }
  });

  // Update receipt status (for approve/reject)
  app.patch("/api/receipts/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!['completed', 'pending', 'overdue'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const receipt = await storage.updateReceiptStatus(req.params.id, status);
      if (!receipt) {
        return res.status(404).json({ message: "Receipt not found" });
      }
      res.json(receipt);
    } catch (error) {
      res.status(500).json({ message: "Failed to update receipt status" });
    }
  });

  // Get all schedules
  app.get("/api/schedules", async (req, res) => {
    try {
      const schedules = await storage.getSchedules();
      res.json(schedules);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedules" });
    }
  });

  // Create new schedule
  app.post("/api/schedules", async (req, res) => {
    try {
      const validatedData = insertScheduleSchema.parse(req.body);
      const schedule = await storage.createSchedule(validatedData);
      res.status(201).json(schedule);
    } catch (error) {
      res.status(400).json({ message: "Invalid schedule data" });
    }
  });

  // Update schedule
  app.patch("/api/schedules/:id", async (req, res) => {
    try {
      const validatedData = insertScheduleSchema.partial().parse(req.body);
      const schedule = await storage.updateSchedule(req.params.id, validatedData);
      if (!schedule) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.json(schedule);
    } catch (error) {
      res.status(400).json({ message: "Invalid schedule data" });
    }
  });

  // Delete schedule
  app.delete("/api/schedules/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSchedule(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Schedule not found" });
      }
      res.json({ message: "Schedule deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete schedule" });
    }
  });

  // Export receipts (placeholder for PDF/Excel generation)
  app.post("/api/receipts/export", async (req, res) => {
    try {
      const { format, filters } = req.body;
      const receipts = await storage.getReceipts(filters);
      
      // In a real implementation, this would generate PDF/Excel
      res.json({ 
        message: `Export of ${receipts.length} receipts in ${format} format initiated`,
        count: receipts.length,
        format
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to export receipts" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
