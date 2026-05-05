import { v4 as uuidv4 } from 'uuid';
import { BaseTracedQuery } from '../BaseTracedQuery';
import { invoiceMetrics } from '@infrastructure';

export class GetInvoiceByBusinessKeyQuery extends BaseTracedQuery<GetInvoiceByBusinessKeyQuery, unknown> {
  readonly queryId = uuidv4();
  readonly createdAt = new Date();
  readonly createdBy?: string;
  readonly correlationId?: string;
  readonly invoiceYear: number;
  readonly invoiceNumber: number;

  protected readonly queryName = 'GetInvoiceByBusinessKeyQuery';
  protected readonly metrics = {
    counter: invoiceMetrics.invoicesRetrieved,
    histogram: invoiceMetrics.invoiceRetrieveDuration,
    counterLabels: { type: 'business_key' },
    histogramLabels: { type: 'business_key' },
  };

  constructor(
    invoiceYear: number,
    invoiceNumber: number,
    createdBy?: string,
    correlationId?: string
  ) {
    super();
    this.invoiceYear = invoiceYear;
    this.invoiceNumber = invoiceNumber;
    this.createdBy = createdBy;
    this.correlationId = correlationId;
  }
}

