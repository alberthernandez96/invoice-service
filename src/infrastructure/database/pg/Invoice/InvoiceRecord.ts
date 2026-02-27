export interface InvoiceRecord {
  id: number;
  client_id: string;
  status: string;
  vat: number;
  date_init?: string;
  date_end?: string;
  reference?: string;
  date_paid?: string;
  detail_deposit?: number;
  paid_option?: string;
  percentage_discount?: number;
  extra_location?: number;
  coordinates?: { lat: number; lng: number };
  location?: string;
  created_at: string;
  updated_at?: string;
  updated_by?: string;
}
