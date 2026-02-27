import { MetricsFactory } from '@albertoficial/observability-shared';

const metricsFactory = new MetricsFactory('invoice-service', '1.0.0');

export const invoiceMetrics = {
  invoicesCreated: metricsFactory.createCounter('invoices.created', {
    description: 'Total number of invoices created',
  }),

  invoicesUpdated: metricsFactory.createCounter('invoices.updated', {
    description: 'Total number of invoices updated',
  }),

  invoicesRetrieved: metricsFactory.createCounter('invoices.retrieved', {
    description: 'Total number of invoices retrieved',
  }),

  invoicesDeleted: metricsFactory.createCounter('invoices.deleted', {
    description: 'Total number of invoices deleted',
  }),

  invoiceCreateDuration: metricsFactory.createHistogram('invoices.create.duration', {
    description: 'Duration of invoice creation operations in milliseconds',
    unit: 'ms',
  }),

  invoiceUpdateDuration: metricsFactory.createHistogram('invoices.update.duration', {
    description: 'Duration of invoice update operations in milliseconds',
    unit: 'ms',
  }),

  invoiceRetrieveDuration: metricsFactory.createHistogram('invoices.retrieve.duration', {
    description: 'Duration of invoice retrieval operations in milliseconds',
    unit: 'ms',
  }),
};
