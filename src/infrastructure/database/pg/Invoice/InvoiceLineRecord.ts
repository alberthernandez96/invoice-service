export interface InvoiceLineRecord {
  id: string;
  type: string;
  invoice_id: number;
  product_id: string;
  quantity: number;
  unit_price: number;
  comment?: string;
  position: number;
}
