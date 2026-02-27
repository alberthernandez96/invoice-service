import { InvoiceEntity, type InvoiceEntityState } from "@domain";
import {
  InvoiceRecord,
  InvoiceLineRecord,
  InvoiceRecordWithLines,
} from "infrastructure";

export class InvoiceDomainMapper {
  static toDatabase(entity: InvoiceEntity): InvoiceRecordWithLines {
    return {
      id: entity.getId(),
      client_id: entity.getClientId(),
      status: entity.getStatus(),
      vat: entity.getVat(),
      lines: entity.getLines().map((line, position) => ({
        id: line.id,
        type: line.type,
        comment: line.comment,
        quantity: line.quantity,
        invoice_id: entity.getId(),
        product_id: line.productId,
        unit_price: line.unitPrice,
        position,
      })),
      date_init: entity.getDateInit(),
      date_end: entity.getDateEnd(),
      reference: entity.getReference(),
      date_paid: entity.getDatePaid(),
      detail_deposit: entity.getDetailDeposit(),
      paid_option: entity.getPaidOption(),
      percentage_discount: entity.getPercentageDiscount(),
      extra_location: entity.getExtraLocation(),
      coordinates: entity.getCoordinates(),
      location: entity.getLocation(),
      created_at: entity.getCreatedAt(),
      updated_at: entity.getUpdatedAt(),
      updated_by: entity.getUpdatedBy(),
    };
  }

  static fromDatabase(record: InvoiceRecordWithLines): InvoiceEntity {
    const state: InvoiceEntityState = {
      id: record.id,
      status: record.status,
      vat: record.vat,
      clientId: record.client_id,
      lines: record.lines.map((line) => ({
        id: line.id,
        type: line.type,
        comment: line.comment,
        quantity: line.quantity,
        productId: line.product_id,
        unitPrice: line.unit_price,
      })),
      dateInit: record.date_init,
      dateEnd: record.date_end,
      reference: record.reference,
      datePaid: record.date_paid,
      detailDeposit: record.detail_deposit,
      paidOption: record.paid_option,
      percentageDiscount: record.percentage_discount,
      extraLocation: record.extra_location,
      location: record.location,
      coordinates: record.coordinates,
      createdAt: record.created_at,
      updatedAt: record.updated_at,
      updatedBy: record.updated_by,
    };
    return InvoiceEntity.rehydrate(state);
  }
}
