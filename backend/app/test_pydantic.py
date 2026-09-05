from backend.app.models.document_schemas import Invoice


invoice = Invoice(
    vendor="ABC Technologies",
    invoice_number="INV-2026-1024",
    invoice_date="2026-08-10",
    subtotal=45000,
    tax=8100,
    total=53100,
    currency="INR"
)

print("Pydantic object:")
print(invoice)

print("\nDictionary:")
print(invoice.model_dump())

print("\nJSON:")
print(invoice.model_dump_json(indent=2))
