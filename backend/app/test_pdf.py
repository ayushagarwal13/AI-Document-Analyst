from backend.app.services.document_service import extract_text_from_pdf


file_path = "sample.pdf"

text = extract_text_from_pdf(file_path)

print("Extracted Text:")
print("-" * 50)
print(text)
