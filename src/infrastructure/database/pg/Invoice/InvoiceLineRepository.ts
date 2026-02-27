import type { Pool, PoolClient } from "pg";
import type { InvoiceLineRecord } from "./InvoiceLineRecord";

type Queryable = Pool | PoolClient;

export class InvoiceLineRepository {
  protected readonly tableName = "invoice_lines";
  protected readonly columns: (keyof InvoiceLineRecord & string)[] = [
    "id",
    "invoice_id",
    "product_id",
    "type",
    "comment",
    "quantity",
    "unit_price",
    "position",
  ];

  constructor(protected readonly pool: Pool) {}

  private query(queryable: Queryable, text: string, values?: unknown[]) {
    return queryable.query(text, values);
  }

  async findByInvoiceId(invoiceId: number): Promise<InvoiceLineRecord[]> {
    const cols = this.columns.join(", ");
    const result = await this.query(
      this.pool,
      `SELECT ${cols} FROM ${this.tableName}
       WHERE invoice_id = $1
       ORDER BY position ASC, id ASC`,
      [invoiceId],
    );
    return result.rows as InvoiceLineRecord[];
  }

  async findByInvoiceIds(invoiceIds: number[]): Promise<InvoiceLineRecord[]> {
    if (invoiceIds.length === 0) return [];
    const cols = this.columns.join(", ");
    const placeholders = invoiceIds.map((_, i) => `$${i + 1}`).join(", ");
    const result = await this.query(
      this.pool,
      `SELECT ${cols} FROM ${this.tableName}
       WHERE invoice_id IN (${placeholders})
       ORDER BY invoice_id, position ASC, id ASC`,
      invoiceIds,
    );
    return result.rows as InvoiceLineRecord[];
  }

  async insertMany(
    records: InvoiceLineRecord[],
    client?: PoolClient,
  ): Promise<void> {
    if (records.length === 0) return;
    const queryable = client ?? this.pool;
    const colList = this.columns.join(", ");
    const placeholders = this.columns.map((_, i) => `$${i + 1}`).join(", ");
    const query = `INSERT INTO ${this.tableName} (${colList}) VALUES (${placeholders})`;

    for (const r of records) {
      const values = this.columns.map(
        (c) => r[c as keyof InvoiceLineRecord] ?? null,
      );
      await this.query(queryable, query, values);
    }
  }

  async deleteByInvoiceId(
    invoiceId: number,
    client?: PoolClient,
  ): Promise<void> {
    const queryable = client ?? this.pool;
    await this.query(
      queryable,
      `DELETE FROM ${this.tableName} WHERE invoice_id = $1`,
      [invoiceId],
    );
  }
}
