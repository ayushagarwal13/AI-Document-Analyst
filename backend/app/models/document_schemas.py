from pydantic import BaseModel


class Invoice(BaseModel):
    vendor: str | None = None
    invoice_number: str | None = None
    invoice_date: str | None = None
    subtotal: float | None = None
    tax: float | None = None
    total: float | None = None
    currency: str | None = None


class InvoiceList(BaseModel):
    invoices: list[Invoice]
