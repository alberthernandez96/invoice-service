import { Request, Response } from 'express';
import { CommandBus, AuthenticatedRequest } from '@albertoficial/backend-shared';
import { CreateInvoiceCommand, UpdateInvoiceCommand } from '@application';
import { ErrorHandler } from '@presentation';

export class InvoiceCommandController {
  constructor(private readonly commandBus: CommandBus) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.commandBus.execute(
        new CreateInvoiceCommand(
          req.body,
          (req as AuthenticatedRequest).user?.id,
          req.headers['x-correlation-id'] as string
        )
      );
      res.status(201).json(result);
    } catch (error: unknown) {
      ErrorHandler.handle(error, res, 'InvoiceCommandController.create');
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.commandBus.execute(
        new UpdateInvoiceCommand(
          Number(id),
          req.body,
          (req as AuthenticatedRequest).user?.id,
          req.headers['x-correlation-id'] as string
        )
      );
      res.status(200).json(result);
    } catch (error: unknown) {
      ErrorHandler.handle(error, res, 'InvoiceCommandController.update');
    }
  }
}
