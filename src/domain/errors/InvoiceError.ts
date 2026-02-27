import { DomainError } from '@albertoficial/backend-shared';

export const InvoiceErrorMessages = {
  CLIENT_ID_REQUIRED: 'Client ID is required',
  LINES_REQUIRED: 'At least one line is required',
  INTERNAL_ERROR: 'Internal server error',
} as const;

export const InvoiceErrorCodes = {
  INVOICE_CREATION_FAILED: 'INVOICE_CREATION_FAILED',
  INVOICE_UPDATE_FAILED: 'INVOICE_UPDATE_FAILED',
  INVOICE_NOT_FOUND: 'INVOICE_NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export class InvoiceValidationError extends DomainError {
  constructor(message: string) {
    super(message, InvoiceErrorCodes.VALIDATION_ERROR);
  }
}

export class InvoiceNotFoundError extends DomainError {
  constructor(id: number) {
    super(`Invoice with id ${id} not found`, InvoiceErrorCodes.INVOICE_NOT_FOUND);
  }
}

export class InvoiceLastRegistryNotFoundError extends DomainError {
  constructor() {
    super('No invoices found', InvoiceErrorCodes.INVOICE_NOT_FOUND);
  }
}

export class InvoiceIdMismatchError extends DomainError {
  constructor(id: number, dataId: number) {
    super(`Invoice id ${id} does not match the data id ${dataId}`, InvoiceErrorCodes.VALIDATION_ERROR);
  }
}
