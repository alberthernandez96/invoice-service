import { QueryHandler } from '@albertoficial/backend-shared';
import { InvoiceDtoMapper, GetInvoiceListQuery, IInvoiceRepository } from '@application';

export class GetInvoiceListQueryHandler implements QueryHandler<GetInvoiceListQuery, unknown> {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  async handle(query: GetInvoiceListQuery): Promise<unknown> {
    return query.executeWithTracing(async (qry) => {
      const { items, total } = await this.invoiceRepository.list(qry.limit, (qry.page - 1) * qry.limit);
      const invoiceItems = items.map((q) => InvoiceDtoMapper.toDto(q));
      const totalPages = Math.ceil(total / qry.limit) || 1;

      return {
        items: invoiceItems,
        total,
        page: qry.page,
        limit: qry.limit,
        totalPages,
      };
    });
  }
}
