from backend.app.services.document_service import (
    extract_text_from_document,
)


file_path = "does_not_exist.pdf"

text = extract_text_from_document(file_path)

print("Extracted Text:")
print("-" * 50)
print(text)
