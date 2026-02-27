import { InvoiceEntity } from '@domain';

export interface IInvoiceRepository {
  findById(id: number): Promise<InvoiceEntity | null>;
  findLastRegistry(): Promise<InvoiceEntity | null>;
  save(invoice: InvoiceEntity): Promise<number>;
  update(invoice: InvoiceEntity): Promise<void>;
  list(limit: number, offset: number): Promise<{ items: InvoiceEntity[]; total: number }>;
  delete(id: number): Promise<void>;
}
