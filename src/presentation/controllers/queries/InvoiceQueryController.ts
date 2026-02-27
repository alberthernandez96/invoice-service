import { Request, Response } from "express";
import {
  InvoiceResponseDTO,
  getInvoiceListQuerySchema,
} from "@albertoficial/api-contracts";
import { AuthenticatedRequest, QueryBus } from "@albertoficial/backend-shared";
import {
  GetLastRegistryQuery,
  GetInvoiceQuery,
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
