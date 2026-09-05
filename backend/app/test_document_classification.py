from backend.app.services.document_service import (
    extract_text_from_document,
)

from backend.app.services.llm_service import (
    classify_document,
)


file_path = "invoice.pdf"

document_text = extract_text_from_document(file_path)

document_type = classify_document(document_text)

print("DOCUMENT TYPE:")
print("-" * 50)
print(document_type)
