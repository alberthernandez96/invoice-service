import { QueryHandler } from '@albertoficial/backend-shared';
import { InvoiceNotFoundError } from '@domain';
import { InvoiceDtoMapper, GetInvoiceQuery, IInvoiceRepository } from '@application';

export class GetInvoiceQueryHandler implements QueryHandler<GetInvoiceQuery, unknown> {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  async handle(query: GetInvoiceQuery): Promise<unknown> {
    return query.executeWithTracing(async (qry) => {
      const invoice = await this.invoiceRepository.findById(qry.id);
      if (!invoice) {
        throw new InvoiceNotFoundError(qry.id);
      }
      return InvoiceDtoMapper.toDto(invoice);
    });
  }
}
