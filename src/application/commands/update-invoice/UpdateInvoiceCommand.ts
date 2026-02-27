import { v4 as uuidv4 } from 'uuid';
import { BaseTracedCommand } from '../BaseTracedCommand';
import { invoiceMetrics } from '@infrastructure';
import { InvoiceRequestDTO } from '@albertoficial/api-contracts';

export class UpdateInvoiceCommand extends BaseTracedCommand<UpdateInvoiceCommand, unknown> {
  readonly commandId = uuidv4();
  readonly createdAt = new Date();
  readonly id: number;
  readonly data: InvoiceRequestDTO;
  readonly updatedBy?: string;
  readonly correlationId?: string;

  protected readonly commandName = 'UpdateInvoiceCommand';
  protected readonly metrics = {
    counter: invoiceMetrics.invoicesUpdated,
    histogram: invoiceMetrics.invoiceUpdateDuration,
  };

  constructor(
    id: number,
    data: InvoiceRequestDTO,
    updatedBy?: string,
    correlationId?: string
  ) {
    super();
    this.id = id;
    this.data = data;
    this.updatedBy = updatedBy;
    this.correlationId = correlationId;
  }
}
