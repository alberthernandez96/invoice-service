import type {
  InvoiceRequestDTO,
  InvoiceResponseDTO,
} from "@albertoficial/api-contracts";
import type { InvoiceEntity, InvoiceEntityState } from "@domain";

export class InvoiceDtoMapper {
  static fromDto(dto: InvoiceRequestDTO): InvoiceEntityState {
    return {
      id: dto.id,
      clientId: dto.clientId,
      status: dto.status,
      vat: dto.vat,
      dateInit: dto.dateInit,
      dateEnd: dto.dateEnd,
      reference: dto.reference,
      datePaid: dto.datePaid,
      detailDeposit: dto.detailDeposit,
      paidOption: dto.paidOption,
      percentageDiscount: dto.percentageDiscount,
      extraLocation: dto.extraLocation,
      coordinates: dto.coordinates,
      location: dto.location,
      createdAt: dto.createdAt,
      lines: dto.lines.map((line, position) => ({
        id: line.id,
        type: line.type,
        comment: line.comment,
        productId: line.productId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        position,
      })),
    };
  }

  static toDto(entity: InvoiceEntity): InvoiceResponseDTO {
    return {
      id: entity.getId(),
      clientId: entity.getClientId(),
      lines: entity.getLines(),
      status: entity.getStatus(),
      vat: entity.getVat(),
      dateInit: entity.getDateInit(),
      dateEnd: entity.getDateEnd(),
      reference: entity.getReference(),
      datePaid: entity.getDatePaid(),
      detailDeposit: entity.getDetailDeposit(),
      paidOption: entity.getPaidOption(),
      percentageDiscount: entity.getPercentageDiscount(),
      extraLocation: entity.getExtraLocation(),
      coordinates: entity.getCoordinates(),
      location: entity.getLocation(),
      createdAt: entity.getCreatedAt(),
    };
  }
}
