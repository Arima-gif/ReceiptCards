import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const receipts = pgTable("receipts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  receiptNumber: text("receipt_number").notNull().unique(),
  datetime: timestamp("datetime").notNull().default(sql`now()`),
  entity: text("entity").notNull(),
  vehicle: text("vehicle"),
  staff: text("staff").notNull(),
  branch: text("branch").notNull(),
  paymentMethod: text("payment_method").notNull(), // 'cash', 'credit', 'recovery'
  creditAmount: decimal("credit_amount", { precision: 10, scale: 2 }).default("0"),
  recoveryAmount: decimal("recovery_amount", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  outstandingAmount: decimal("outstanding_amount", { precision: 10, scale: 2 }).default("0"),
  status: text("status").notNull().default("completed"), // 'completed', 'pending', 'overdue'
  // Salesman information
  salesmanName: text("salesman_name").notNull(),
  salesmanPhoto: text("salesman_photo"), // URL to salesman's photo
  salesmanMessage: text("salesman_message"), // Message from salesman
  receiptPhotos: text("receipt_photos").array().default(sql`'{}'`), // Array of photo URLs
});

export const schedules = pgTable("schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  frequency: text("frequency").notNull(), // 'daily', 'weekly', 'monthly'
  time: text("time").notNull(), // HH:MM format
  format: text("format").notNull(), // 'pdf', 'excel', 'both'
  email: text("email"),
  autoDownload: integer("auto_download").default(0), // 0 or 1 (boolean)
  isActive: integer("is_active").default(1),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertReceiptSchema = createInsertSchema(receipts).omit({
  id: true,
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
  createdAt: true,
});

export type InsertReceipt = z.infer<typeof insertReceiptSchema>;
export type Receipt = typeof receipts.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type Schedule = typeof schedules.$inferSelect;
