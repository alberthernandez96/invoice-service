import { v4 as uuidv4 } from 'uuid';
import { BaseTracedQuery } from '../BaseTracedQuery';
import { invoiceMetrics } from '@infrastructure';

export class GetLastRegistryQuery extends BaseTracedQuery<GetLastRegistryQuery, unknown> {
  readonly queryId = uuidv4();
  readonly createdAt = new Date();
  readonly createdBy?: string;
  readonly correlationId?: string;

  protected readonly queryName = 'GetLastRegistryQuery';
  protected readonly metrics = {
    counter: invoiceMetrics.invoicesRetrieved,
    histogram: invoiceMetrics.invoiceRetrieveDuration,
    counterLabels: { type: 'last' },
    histogramLabels: { type: 'last' },
  };

  constructor(createdBy?: string, correlationId?: string) {
    super();
    this.createdBy = createdBy;
    this.correlationId = correlationId;
  }
}
