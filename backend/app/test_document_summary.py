from backend.app.services.document_service import (
    extract_text_from_document,
)

from backend.app.services.llm_service import (
    summarize_document,
)


file_path = "sample.pdf"


document_text = extract_text_from_document(file_path)

summary = summarize_document(document_text)

print("DOCUMENT SUMMARY:")
print("-" * 50)
print(summary)
