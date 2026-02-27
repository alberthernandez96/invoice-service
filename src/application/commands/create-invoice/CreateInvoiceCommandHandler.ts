import { CommandHandler } from '@albertoficial/backend-shared';
import { InvoiceEntity } from '@domain';
import { InvoiceDtoMapper, CreateInvoiceCommand, IInvoiceRepository } from '@application';

export class CreateInvoiceCommandHandler implements CommandHandler<CreateInvoiceCommand, unknown> {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  async handle(command: CreateInvoiceCommand): Promise<unknown> {
    return command.executeWithTracing(async (cmd) => {
      const props = InvoiceDtoMapper.fromDto(cmd.data);
      const invoice = InvoiceEntity.create(props);
      const invoiceId = await this.invoiceRepository.save(invoice);

      const savedInvoice = await this.invoiceRepository.findById(invoiceId);
      if (!savedInvoice) {
        throw new Error('Failed to retrieve saved invoice');
      }

      return InvoiceDtoMapper.toDto(savedInvoice);
    });
  }
}
