import { QueryHandler } from '@albertoficial/backend-shared';
import { InvoiceLastRegistryNotFoundError } from '@domain';
import { InvoiceDtoMapper, GetLastRegistryQuery, IInvoiceRepository } from '@application';

export class GetLastRegistryQueryHandler implements QueryHandler<GetLastRegistryQuery, unknown> {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  async handle(query: GetLastRegistryQuery): Promise<unknown> {
    return query.executeWithTracing(async () => {
      const invoice = await this.invoiceRepository.findLastRegistry();
      if (!invoice) {
        throw new InvoiceLastRegistryNotFoundError();
      }
      return InvoiceDtoMapper.toDto(invoice);
    });
  }
}
