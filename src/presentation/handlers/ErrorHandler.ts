import { Response } from 'express';
import { ErrorHandler as BaseErrorHandler } from '@albertoficial/backend-shared';
import { InvoiceErrorCodes } from '@domain';

export class ErrorHandler extends BaseErrorHandler {
  constructor() {
    super({
      [InvoiceErrorCodes.INVOICE_NOT_FOUND]: 404,
      [InvoiceErrorCodes.VALIDATION_ERROR]: 400,
      [InvoiceErrorCodes.INVOICE_CREATION_FAILED]: 400,
      [InvoiceErrorCodes.INVOICE_UPDATE_FAILED]: 400,
      [InvoiceErrorCodes.INTERNAL_ERROR]: 500,
    });
  }

  static handle(error: unknown, res: Response, context?: string): void {
    const handler = new ErrorHandler();
    handler.handle(error, res, context);
  }
}
