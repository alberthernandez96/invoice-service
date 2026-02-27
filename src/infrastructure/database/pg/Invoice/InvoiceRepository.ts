import type { Pool, PoolClient } from "pg";
import type { InvoiceRecord } from "./InvoiceRecord";
import type { InvoiceLineRecord } from "./InvoiceLineRecord";
import { InvoiceLineRepository } from "./InvoiceLineRepository";

export interface InvoiceRecordWithLines extends InvoiceRecord {
  lines: InvoiceLineRecord[];
}

const INVOICE_COLUMNS = [
  "id",
  "client_id",
  "status",
  "vat",
  "date_init",
  "date_end",
  "reference",
  "date_paid",
  "detail_deposit",
  "paid_option",
  "percentage_discount",
  "extra_location",
  "coordinates",
  "location",
  "created_at",
  "updated_at",
  "updated_by",
] as const;

export class InvoiceRepository {
  protected readonly tableName = "invoices";
  protected readonly columns = INVOICE_COLUMNS;
  private readonly lineRepo: InvoiceLineRepository;

  constructor(private readonly pool: Pool) {
    this.lineRepo = new InvoiceLineRepository(pool);
  }

  async findById(id: number): Promise<InvoiceRecordWithLines | null> {
    const cols = this.columns.join(", ");
    const result = await this.pool.query(
      `SELECT ${cols} FROM ${this.tableName} WHERE id = $1`,
      [id],
    );
    const invoice = result.rows[0] as InvoiceRecord | undefined;
    if (!invoice?.id) return null;
    const lines = await this.lineRepo.findByInvoiceId(invoice.id);
    return { ...invoice, lines };
  }

  async findLastRegistry(): Promise<InvoiceRecordWithLines | null> {
    const cols = this.columns.join(", ");
    const result = await this.pool.query(
      `SELECT ${cols} FROM ${this.tableName} ORDER BY created_at DESC LIMIT 1`,
    );
    const invoice = result.rows[0] as InvoiceRecord | undefined;
    if (!invoice?.id) return null;
    const lines = await this.lineRepo.findByInvoiceId(invoice.id);
    return { ...invoice, lines };
  }

  async save(invoice: InvoiceRecordWithLines): Promise<number> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await this.upsertRecordWithClient(invoice, client);
      await this.lineRepo.deleteByInvoiceId(invoice.id, client);
      const linesWithInvoiceId = invoice.lines.map((l) => ({
        ...l,
        invoice_id: invoice.id,
      }));
      await this.lineRepo.insertMany(linesWithInvoiceId, client);
      await client.query("COMMIT");
      return invoice.id;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  private async upsertRecordWithClient(
    record: InvoiceRecord,
    client: PoolClient,
  ): Promise<void> {
    const cols = [...this.columns];
    const values = cols.map((c) => {
      const v = record[c as keyof InvoiceRecord];
      return v === undefined ? null : v;
    });
    const colList = cols.join(", ");
    const placeholders = cols.map((_, i) => `$${i + 1}`).join(", ");
    const updateCols = cols.filter((c) => c !== "id");
    const assignments = updateCols
      .map((c) => `${c} = EXCLUDED.${c}`)
      .join(", ");
    const query = `
      INSERT INTO ${this.tableName} (${colList})
      VALUES (${placeholders})
      ON CONFLICT (id) DO UPDATE SET ${assignments}
    `;
    await client.query(query, values);
  }

  async list(
    limit: number,
    offset: number,
  ): Promise<{ rows: InvoiceRecordWithLines[]; total: number }> {
    const countResult = await this.pool.query(
      `SELECT COUNT(*)::int AS total FROM ${this.tableName}`,
    );
    const total = (countResult.rows[0] as { total: number }).total;
    const cols = this.columns.join(", ");
    const result = await this.pool.query(
      `SELECT ${cols} FROM ${this.tableName} ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset],
    );
    const invoices = result.rows as InvoiceRecord[];
    if (invoices.length === 0) return { rows: [], total };
    const invoiceIds = invoices.map((i) => i.id);
    const allLines = await this.lineRepo.findByInvoiceIds(invoiceIds);
    const linesByInvoiceId = new Map<string, InvoiceLineRecord[]>();
    for (const line of allLines) {
      const list = linesByInvoiceId.get(String(line.invoice_id)) ?? [];
      list.push(line);
      linesByInvoiceId.set(String(line.invoice_id), list);
    }
    const rows: InvoiceRecordWithLines[] = invoices.map((i) => ({
      ...i,
      lines: linesByInvoiceId.get(String(i.id)) ?? [],
    }));
    return { rows, total };
  }

  async delete(id: number): Promise<void> {
    await this.pool.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
  }
}
