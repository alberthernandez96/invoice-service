import type { InvoiceEntity } from '@domain';
import type { IInvoiceRepository } from '@application';
import { InvoiceRepository } from '../database';
import { InvoiceDomainMapper } from '../mappers';

export class InvoiceRepositoryAdapter implements IInvoiceRepository {
  constructor(private readonly postgresRepo: InvoiceRepository) {}

  async findById(id: number): Promise<InvoiceEntity | null> {
    const record = await this.postgresRepo.findById(id);
    return record ? InvoiceDomainMapper.fromDatabase(record) : null;
  }

  async findLastRegistry(): Promise<InvoiceEntity | null> {
    const record = await this.postgresRepo.findLastRegistry();
    return record ? InvoiceDomainMapper.fromDatabase(record) : null;
  }

  async save(invoice: InvoiceEntity): Promise<number> {
    const invoiceRecord = InvoiceDomainMapper.toDatabase(invoice);
    return await this.postgresRepo.save(invoiceRecord);
  }

  async update(invoice: InvoiceEntity): Promise<void> {
    const invoiceRecord = InvoiceDomainMapper.toDatabase(invoice);
    await this.postgresRepo.save(invoiceRecord);
  }

  async list(limit: number, offset: number): Promise<{ items: InvoiceEntity[]; total: number }> {
    const { rows, total } = await this.postgresRepo.list(limit, offset);
    return {
      items: rows.map((r) => InvoiceDomainMapper.fromDatabase(r)),
      total,
    };
  }

  async delete(id: number): Promise<void> {
    await this.postgresRepo.delete(id);
  }
}
