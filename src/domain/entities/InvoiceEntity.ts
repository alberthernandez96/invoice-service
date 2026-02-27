import type {
  InvoiceEntityState,
  InvoiceLineEntity,
} from "./InvoiceEntity.types";

export class InvoiceEntity {
  private readonly state: InvoiceEntityState;

  private constructor(state: InvoiceEntityState) {
    this.state = state;
  }

  static create(props: InvoiceEntityState): InvoiceEntity {
    return new InvoiceEntity(props);
  }

  static rehydrate(state: InvoiceEntityState): InvoiceEntity {
    return new InvoiceEntity(state);
  }

  getId(): number {
    return this.state.id;
  }

  getClientId(): string {
    return this.state.clientId;
  }

  getLines(): InvoiceLineEntity[] {
    return this.state.lines;
  }

  getStatus(): string {
    return this.state.status;
  }

  getVat(): number {
    return this.state.vat;
  }

  getDateInit(): string | undefined {
    return this.state.dateInit;
  }

  getDateEnd(): string | undefined {
    return this.state.dateEnd;
  }

  getReference(): string | undefined {
    return this.state.reference;
  }

  getDatePaid(): string | undefined {
    return this.state.datePaid;
  }

  getDetailDeposit(): number | undefined {
    return this.state.detailDeposit;
  }

  getPaidOption(): string | undefined {
    return this.state.paidOption;
  }

  getPercentageDiscount(): number | undefined {
    return this.state.percentageDiscount;
  }

  getExtraLocation(): number | undefined {
    return this.state.extraLocation;
  }

  getLocation() {
    return this.state.location;
  }
  getCoordinates(): { lat: number; lng: number } | undefined {
    return this.state.coordinates;
  }

  getCreatedAt(): string {
    return this.state.createdAt;
  }

  getUpdatedAt(): string | undefined {
    return this.state.updatedAt;
  }

  getUpdatedBy(): string | undefined {
    return this.state.updatedBy;
  }
}
