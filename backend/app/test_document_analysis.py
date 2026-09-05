from backend.app.services.document_service import (
    extract_text_from_document,
)

from backend.app.services.llm_service import (
    analyze_document,
)


file_path = "sample.pdf"


document_text = extract_text_from_document(file_path)

analysis = analyze_document(document_text)

print("DOCUMENT ANALYSIS:")
print("-" * 50)
print(analysis)
