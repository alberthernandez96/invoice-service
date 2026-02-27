import { v4 as uuidv4 } from 'uuid';
import { BaseTracedCommand } from '../BaseTracedCommand';
import { invoiceMetrics } from '@infrastructure';
import { type TracedHandlerContext } from '@albertoficial/observability-shared';
import { InvoiceRequestDTO } from '@albertoficial/api-contracts';

export class CreateInvoiceCommand extends BaseTracedCommand<CreateInvoiceCommand, unknown> {
  readonly commandId = uuidv4();
  readonly createdAt = new Date();
  readonly data: InvoiceRequestDTO;
  readonly createdBy?: string;
  readonly correlationId?: string;

  protected readonly commandName = 'CreateInvoiceCommand';
  protected readonly metrics = {
    counter: invoiceMetrics.invoicesCreated,
    histogram: invoiceMetrics.invoiceCreateDuration,
  };

  constructor(
    data: InvoiceRequestDTO,
    createdBy?: string,
    correlationId?: string
  ) {
    super();
    this.data = data;
    this.createdBy = createdBy;
    this.correlationId = correlationId;
  }

  protected onSuccess(
    result: unknown,
    _duration: number,
    span: TracedHandlerContext['span']
  ): void {
    const dto = result as { id?: string; clientId?: string };

    if (dto?.id) {
      span.setAttribute('invoice.id', String(dto.id));
    }

    if (this.data?.clientId) {
      span.setAttribute('invoice.client_id', this.data.clientId);
    }
  }
}
