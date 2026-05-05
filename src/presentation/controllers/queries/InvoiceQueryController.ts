import { Request, Response } from "express";
import {
  InvoiceResponseDTO,
  getInvoiceListQuerySchema,
  getInvoiceByBusinessKeyParamsSchema,
} from "@albertoficial/api-contracts";
import { AuthenticatedRequest, QueryBus } from "@albertoficial/backend-shared";
import {
  GetLastRegistryQuery,
  GetInvoiceQuery,
  GetInvoiceByBusinessKeyQuery,
  GetInvoiceListQuery,
} from "@application";
import { ErrorHandler } from "@presentation";

export class InvoiceQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  async get(req: Request, res: Response<InvoiceResponseDTO>): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.queryBus.execute<InvoiceResponseDTO>(
        new GetInvoiceQuery(
          Number(id),
          (req as AuthenticatedRequest).user?.id,
          req.headers["x-correlation-id"] as string,
        ),
      );
      res.status(200).json(result);
    } catch (error: unknown) {
      ErrorHandler.handle(error, res, "InvoiceQueryController.get");
    }
  }

  async getByBusinessKey(
    req: Request,
    res: Response<InvoiceResponseDTO>,
  ): Promise<void> {
    try {
      const params = getInvoiceByBusinessKeyParamsSchema.parse({
        invoiceYear: Number(req.params.invoiceYear),
        invoiceNumber: Number(req.params.invoiceNumber),
      });

      const result = await this.queryBus.execute<InvoiceResponseDTO>(
        new GetInvoiceByBusinessKeyQuery(
          params.invoiceYear,
          params.invoiceNumber,
          (req as AuthenticatedRequest).user?.id,
          req.headers["x-correlation-id"] as string,
        ),
      );
      res.status(200).json(result);
    } catch (error: unknown) {
      ErrorHandler.handle(
        error,
        res,
        "InvoiceQueryController.getByBusinessKey",
      );
    }
  }

  async getLastRegistry(
    req: Request,
    res: Response<InvoiceResponseDTO>,
  ): Promise<void> {
    try {
      const result = await this.queryBus.execute<InvoiceResponseDTO>(
        new GetLastRegistryQuery(
          (req as AuthenticatedRequest).user?.id,
          req.headers["x-correlation-id"] as string,
        ),
      );
      res.status(200).json(result);
    } catch (error: unknown) {
      ErrorHandler.handle(error, res, "InvoiceQueryController.getLastRegistry");
    }
  }

  async getAll(
    req: Request,
    res: Response<InvoiceResponseDTO[]>,
  ): Promise<void> {
    try {
      const { page, limit } = getInvoiceListQuerySchema.parse(req.query);
      const result = await this.queryBus.execute<InvoiceResponseDTO[]>(
        new GetInvoiceListQuery(
          page,
          limit,
          (req as AuthenticatedRequest).user?.id,
          req.headers["x-correlation-id"] as string,
        ),
      );
      res.status(200).json(result);
    } catch (error: unknown) {
      ErrorHandler.handle(error, res, "InvoiceQueryController.getAll");
    }
  }
}
