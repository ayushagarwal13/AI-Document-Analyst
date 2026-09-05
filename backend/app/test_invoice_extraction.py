from backend.app.services.document_service import (
    extract_text_from_document,
)

from backend.app.services.llm_service import (
    extract_invoice_data,
)


file_path = "invoice.pdf"

document_text = extract_text_from_document(file_path)

invoice_list = extract_invoice_data(document_text)

print("VALIDATED INVOICES:")
print("-" * 50)

for index, invoice in enumerate(invoice_list.invoices, start=1):
    print(f"\nInvoice {index}:")
    print(invoice)


print("\nJSON OUTPUT:")
print("-" * 50)
print(invoice_list.model_dump_json(indent=2))
