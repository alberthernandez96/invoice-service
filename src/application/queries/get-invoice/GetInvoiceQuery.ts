import { v4 as uuidv4 } from 'uuid';
import { BaseTracedQuery } from '../BaseTracedQuery';
import { invoiceMetrics } from '@infrastructure';

export class GetInvoiceQuery extends BaseTracedQuery<GetInvoiceQuery, unknown> {
  readonly queryId = uuidv4();
  readonly createdAt = new Date();
  readonly createdBy?: string;
  readonly correlationId?: string;
  readonly id: number;

  protected readonly queryName = 'GetInvoiceQuery';
  protected readonly metrics = {
    counter: invoiceMetrics.invoicesRetrieved,
    histogram: invoiceMetrics.invoiceRetrieveDuration,
    counterLabels: { type: 'single' },
    histogramLabels: { type: 'single' },
  };

  constructor(
    id: number,
    createdBy?: string,
    correlationId?: string
  ) {
    super();
    this.id = id;
    this.createdBy = createdBy;
    this.correlationId = correlationId;
  }
}
