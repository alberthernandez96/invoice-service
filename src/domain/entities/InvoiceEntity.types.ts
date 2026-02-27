import { z } from "zod";

const invoiceLineSchema = z.object({
  id: z.string().uuid("Invalid line ID"),
  type: z.string().min(1, "Type is required").max(50, "Type is too long"),
  comment: z.string().max(500).optional(),
  productId: z.string().uuid("Invalid product ID"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().nonnegative("Unit price must be zero or positive"),
});

const InvoiceSchema = z.object({
  id: z.number().int().min(1, "Invoice ID must be at least 1"),
  clientId: z
    .string()
    .min(1, "Client ID is required")
    .max(20, "Client ID is too long"),
  lines: z.array(invoiceLineSchema).min(1, "At least one line is required"),
  status: z.string().max(50),
  vat: z.number().min(0).max(100, "VAT must be between 0 and 100"),
  dateInit: z.string().optional(),
  dateEnd: z.string().optional(),
  reference: z.string().max(100).optional(),
  datePaid: z.string().optional(),
  detailDeposit: z
    .number()
    .min(0)
    .max(100, "Detail deposit must be between 0 and 100")
    .optional(),
  paidOption: z.string().max(50).optional(),
  percentageDiscount: z
    .number()
    .min(-100)
    .max(100, "Percentage discount between -100 and 100")
    .optional(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .optional(),
  location: z.string().max(500).optional(),
  extraLocation: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type InvoiceEntityState = z.infer<typeof InvoiceSchema>;
export type InvoiceLineEntity = z.infer<typeof invoiceLineSchema>;
