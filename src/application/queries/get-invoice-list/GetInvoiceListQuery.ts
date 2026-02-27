import { v4 as uuidv4 } from 'uuid';
import { BaseTracedQuery } from '../BaseTracedQuery';
import { invoiceMetrics } from '@infrastructure';
import { type TracedHandlerContext } from '@albertoficial/observability-shared';

export class GetInvoiceListQuery extends BaseTracedQuery<GetInvoiceListQuery, unknown> {
  readonly queryId = uuidv4();
  readonly createdAt = new Date();
  readonly createdBy?: string;
  readonly correlationId?: string;
  readonly page: number;
  readonly limit: number;

  protected readonly queryName = 'GetInvoiceListQuery';
  protected readonly metrics = {
    counter: invoiceMetrics.invoicesRetrieved,
    histogram: invoiceMetrics.invoiceRetrieveDuration,
    counterLabels: { type: 'list' },
    histogramLabels: { type: 'list' },
  };

  constructor(
    page: number,
    limit: number,
    createdBy?: string,
    correlationId?: string
  ) {
    super();
    this.page = page;
    this.limit = limit;
    this.createdBy = createdBy;
    this.correlationId = correlationId;
  }

  protected onSuccess(
    result: unknown,
    _duration: number,
    span: TracedHandlerContext['span']
  ): void {
    const response = result as { items?: unknown[]; total?: number };

    if (response?.items) {
      span.setAttribute('invoices.count', response.items.length);
    }

    if (response?.total !== undefined) {
      span.setAttribute('invoices.total', response.total);
    }
  }
}
