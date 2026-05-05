import { QueryHandler } from '@albertoficial/backend-shared';
import { InvoiceNotFoundError } from '@domain';
import {
  GetInvoiceByBusinessKeyQuery,
  IInvoiceRepository,
  InvoiceDtoMapper,
} from '@application';

export class GetInvoiceByBusinessKeyQueryHandler
  implements QueryHandler<GetInvoiceByBusinessKeyQuery, unknown>
{
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  async handle(query: GetInvoiceByBusinessKeyQuery): Promise<unknown> {
    return query.executeWithTracing(async (qry) => {
      const invoice = await this.invoiceRepository.findByBusinessKey(
        qry.invoiceYear,
        qry.invoiceNumber,
      );
      if (!invoice) {
        throw new InvoiceNotFoundError(qry.invoiceNumber);
      }
      return InvoiceDtoMapper.toDto(invoice);
    });
  }
}

