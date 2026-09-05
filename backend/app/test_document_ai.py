from backend.app.services.document_service import (
    extract_text_from_document,
)

from backend.app.services.llm_service import (
    ask_question_about_document,
)


file_path = "sample.pdf"

question = "Give me a short summary of this document."


document_text = extract_text_from_document(file_path)

answer = ask_question_about_document(
    document_text=document_text,
    question=question,
)

print("ANSWER:")
print("-" * 50)
print(answer)
