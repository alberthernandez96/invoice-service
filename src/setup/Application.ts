import { Server } from 'http';
import cors from 'cors';
import express, { Express } from 'express';
import {
  CommandBus,
  QueryBus,
  ValidationMiddleware,
  AuthMiddleware,
} from '@albertoficial/backend-shared';
import {
  getInvoiceParamsSchema,
  InvoiceRoutes,
  invoiceSchema,
} from '@albertoficial/api-contracts';
import {
  CreateInvoiceCommand,
  CreateInvoiceCommandHandler,
  UpdateInvoiceCommand,
  UpdateInvoiceCommandHandler,
  GetLastRegistryQuery,
  GetLastRegistryQueryHandler,
  GetInvoiceQuery,
  GetInvoiceQueryHandler,
  GetInvoiceListQuery,
  GetInvoiceListQueryHandler,
} from '@application';
import {
  InvoiceCommandController,
  InvoiceQueryController,
} from '@presentation';
import { InvoiceRepositoryAdapter } from '@infrastructure';
import { observability } from './Observability';
import { Infrastructure } from './Infrastructure';

export class Application {
  private app: Express;
  private server?: Server;

  constructor(infrastructure: Infrastructure) {
    this.app = express();
    if (process.env.NODE_ENV === 'development') {
      this.app.use(cors());
    }
    this.app.use(express.json());

    this.app.use(observability.getTracingMiddleware());

    this.app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
    this.app.get('/metrics', observability.getMetrics());

    const commandBus = new CommandBus();
    const queryBus = new QueryBus();

    const repos = infrastructure.getRepositories();
    const invoiceRepositoryAdapter = new InvoiceRepositoryAdapter(repos.invoice);

    commandBus.registerMany([
      { type: CreateInvoiceCommand, handler: new CreateInvoiceCommandHandler(invoiceRepositoryAdapter) },
      { type: UpdateInvoiceCommand, handler: new UpdateInvoiceCommandHandler(invoiceRepositoryAdapter) },
    ]);
    queryBus.registerMany([
      { type: GetInvoiceQuery, handler: new GetInvoiceQueryHandler(invoiceRepositoryAdapter) },
      { type: GetLastRegistryQuery, handler: new GetLastRegistryQueryHandler(invoiceRepositoryAdapter) },
      { type: GetInvoiceListQuery, handler: new GetInvoiceListQueryHandler(invoiceRepositoryAdapter) },
    ]);

    const invoiceCommandController = new InvoiceCommandController(commandBus);
    const invoiceQueryController = new InvoiceQueryController(queryBus);

    this.app.post(
      InvoiceRoutes.create,
      AuthMiddleware.authenticate(),
      ValidationMiddleware.validateBody(invoiceSchema),
      (req, res) => invoiceCommandController.create(req, res)
    );
    this.app.get(InvoiceRoutes.getLastRegistry, (req, res) => invoiceQueryController.getLastRegistry(req, res));
    this.app.get(
      InvoiceRoutes.get,
      ValidationMiddleware.validateParams(getInvoiceParamsSchema),
      (req, res) => invoiceQueryController.get(req, res)
    );
    this.app.get(InvoiceRoutes.getAll, (req, res) => invoiceQueryController.getAll(req, res));
    this.app.put(
      InvoiceRoutes.update,
      AuthMiddleware.authenticate(),
      ValidationMiddleware.validateParams(getInvoiceParamsSchema),
      ValidationMiddleware.validateBody(invoiceSchema),
      (req, res) => invoiceCommandController.update(req, res)
    );
  }

  async start(): Promise<void> {
    const PORT = process.env.PORT || 3007;
    const logger = observability.getRootLogger();

    this.server = this.app.listen(PORT, () => {
      logger.info({ port: PORT }, `Invoice Service running on port ${PORT}`);
    });
  }

  async shutdown(): Promise<void> {
    if (this.server) {
      this.server.close();
    }
  }
}
