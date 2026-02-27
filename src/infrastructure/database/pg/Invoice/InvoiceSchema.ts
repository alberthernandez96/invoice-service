export const INVOICE_SCHEMA = `
CREATE TABLE IF NOT EXISTS invoices (
  id INTEGER PRIMARY KEY,
  client_id VARCHAR(20) NOT NULL,
  status VARCHAR(50),
  total NUMERIC(12,2),
  vat NUMERIC(5,2),
  date_init TIMESTAMPTZ,
  date_end TIMESTAMPTZ,
  reference VARCHAR(100),
  date_paid TIMESTAMPTZ,
  detail_deposit VARCHAR(500),
  paid_option VARCHAR(50) NOT NULL,
  percentage_discount NUMERIC(5,2),
  extra_location NUMERIC(12,2),
  coordinates JSONB,
  location VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by VARCHAR(255),
  updated_at TIMESTAMPTZ,
  updated_by VARCHAR(255)
);
CREATE INDEX IF NOT EXISTS idx_invoices_id ON invoices (id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices (client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices (created_at DESC);
`;

export const INVOICE_LINES_SCHEMA = `
CREATE TABLE IF NOT EXISTS invoice_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id INTEGER NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  product_id UUID,
  type VARCHAR(50) NOT NULL,
  quantity INTEGER NOT NULL,
  comment VARCHAR(500),
  unit_price NUMERIC(12,2) NOT NULL,
  position INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_invoice_lines_invoice_id ON invoice_lines (invoice_id);
`;
