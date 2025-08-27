import { type Receipt, type InsertReceipt, type Schedule, type InsertSchedule } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Receipts
  getReceipts(filters?: {
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    paymentMethod?: string;
    status?: string;
    entity?: string;
  }): Promise<Receipt[]>;
  getReceiptById(id: string): Promise<Receipt | undefined>;
  createReceipt(receipt: InsertReceipt): Promise<Receipt>;
  updateReceiptStatus(id: string, status: string): Promise<Receipt | undefined>;
  
  // Schedules
  getSchedules(): Promise<Schedule[]>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
  updateSchedule(id: string, schedule: Partial<InsertSchedule>): Promise<Schedule | undefined>;
  deleteSchedule(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private receipts: Map<string, Receipt>;
  private schedules: Map<string, Schedule>;

  constructor() {
    this.receipts = new Map();
    this.schedules = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed with some sample receipts
    const sampleReceipts: InsertReceipt[] = [
      {
        receiptNumber: "56789",
        datetime: new Date("2025-08-20T10:30:00"),
        entity: "Ali Transport",
        vehicle: "ABC-123",
        staff: "Hamza Khan",
        branch: "Main Branch",
        paymentMethod: "cash",
        creditAmount: "5000",
        recoveryAmount: "2000",
        totalAmount: "12000",
        outstandingAmount: "8000",
        status: "completed",
      },
      {
        receiptNumber: "56790",
        datetime: new Date("2025-08-21T14:15:00"),
        entity: "Khan Industries",
        vehicle: "XYZ-456",
        staff: "Ahmed Ali",
        branch: "North Branch",
        paymentMethod: "credit",
        creditAmount: "15000",
        recoveryAmount: "0",
        totalAmount: "15000",
        outstandingAmount: "15000",
        status: "pending",
      },
      {
        receiptNumber: "56791",
        datetime: new Date("2025-08-22T09:45:00"),
        entity: "City Logistics",
        vehicle: "PQR-789",
        staff: "Sara Sheikh",
        branch: "South Branch",
        paymentMethod: "recovery",
        creditAmount: "0",
        recoveryAmount: "8500",
        totalAmount: "8500",
        outstandingAmount: "0",
        status: "completed",
      },
      {
        receiptNumber: "56792",
        datetime: new Date("2025-08-18T16:20:00"),
        entity: "Express Delivery",
        vehicle: "RST-101",
        staff: "Usman Malik",
        branch: "East Branch",
        paymentMethod: "credit",
        creditAmount: "25000",
        recoveryAmount: "5000",
        totalAmount: "30000",
        outstandingAmount: "20000",
        status: "overdue",
      },
    ];

    sampleReceipts.forEach(receipt => {
      this.createReceipt(receipt);
    });
  }

  async getReceipts(filters?: {
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    paymentMethod?: string;
    status?: string;
    entity?: string;
  }): Promise<Receipt[]> {
    let result = Array.from(this.receipts.values());

    if (filters) {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        result = result.filter(r => 
          r.receiptNumber.toLowerCase().includes(searchLower) ||
          r.entity.toLowerCase().includes(searchLower) ||
          r.staff.toLowerCase().includes(searchLower) ||
          r.vehicle?.toLowerCase().includes(searchLower)
        );
      }

      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        result = result.filter(r => new Date(r.datetime) >= fromDate);
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        result = result.filter(r => new Date(r.datetime) <= toDate);
      }

      if (filters.paymentMethod && filters.paymentMethod !== 'all') {
        result = result.filter(r => r.paymentMethod === filters.paymentMethod);
      }

      if (filters.status && filters.status !== 'all') {
        result = result.filter(r => r.status === filters.status);
      }

      if (filters.entity && filters.entity !== 'all') {
        result = result.filter(r => r.entity === filters.entity);
      }
    }

    // Sort by datetime descending
    return result.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
  }

  async getReceiptById(id: string): Promise<Receipt | undefined> {
    return this.receipts.get(id);
  }

  async createReceipt(insertReceipt: InsertReceipt): Promise<Receipt> {
    const id = randomUUID();
    const receipt: Receipt = { 
      ...insertReceipt, 
      id,
      datetime: insertReceipt.datetime || new Date(),
      vehicle: insertReceipt.vehicle || null,
      creditAmount: insertReceipt.creditAmount || "0",
      recoveryAmount: insertReceipt.recoveryAmount || "0",
      outstandingAmount: insertReceipt.outstandingAmount || "0",
      status: insertReceipt.status || "completed"
    };
    this.receipts.set(id, receipt);
    return receipt;
  }

  async updateReceiptStatus(id: string, status: string): Promise<Receipt | undefined> {
    const receipt = this.receipts.get(id);
    if (!receipt) return undefined;

    const updatedReceipt = { ...receipt, status };
    this.receipts.set(id, updatedReceipt);
    return updatedReceipt;
  }

  async getSchedules(): Promise<Schedule[]> {
    return Array.from(this.schedules.values());
  }

  async createSchedule(insertSchedule: InsertSchedule): Promise<Schedule> {
    const id = randomUUID();
    const schedule: Schedule = { 
      ...insertSchedule, 
      id,
      createdAt: new Date(),
      email: insertSchedule.email || null,
      autoDownload: insertSchedule.autoDownload || 0,
      isActive: insertSchedule.isActive || 1
    };
    this.schedules.set(id, schedule);
    return schedule;
  }

  async updateSchedule(id: string, updateData: Partial<InsertSchedule>): Promise<Schedule | undefined> {
    const schedule = this.schedules.get(id);
    if (!schedule) return undefined;

    const updatedSchedule = { ...schedule, ...updateData };
    this.schedules.set(id, updatedSchedule);
    return updatedSchedule;
  }

  async deleteSchedule(id: string): Promise<boolean> {
    return this.schedules.delete(id);
  }
}

export const storage = new MemStorage();
