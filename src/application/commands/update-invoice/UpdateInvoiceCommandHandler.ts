import { CommandHandler } from '@albertoficial/backend-shared';
import { InvoiceEntity, InvoiceNotFoundError } from '@domain';
import { InvoiceDtoMapper, UpdateInvoiceCommand, IInvoiceRepository } from '@application';

export class UpdateInvoiceCommandHandler implements CommandHandler<UpdateInvoiceCommand, unknown> {
  constructor(private readonly invoiceRepository: IInvoiceRepository) {}

  async handle(command: UpdateInvoiceCommand): Promise<unknown> {
    return command.executeWithTracing(async (cmd) => {
      const existing = await this.invoiceRepository.findById(cmd.id);
      if (!existing) {
        throw new InvoiceNotFoundError(cmd.id);
      }

      const state = InvoiceDtoMapper.fromDto(cmd.data);
      state.updatedBy = cmd.updatedBy;

      const invoice = InvoiceEntity.rehydrate(state);
      await this.invoiceRepository.update(invoice);

      return InvoiceDtoMapper.toDto(invoice);
    });
  }
}
