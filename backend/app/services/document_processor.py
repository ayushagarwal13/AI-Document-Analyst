import shutil
from pathlib import Path

from fastapi import HTTPException, UploadFile

from backend.app.services.document_service import extract_text_from_document
from backend.app.services.file_validator import validate_file


UPLOAD_DIR = Path("data/uploads")

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


async def save_and_extract_text(file: UploadFile) -> tuple[str, str]:
    """
    Save an uploaded document and extract its text.

    Returns:
        tuple[str, str]:
        - file path
        - extracted document text
    """

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = extract_text_from_document(str(file_path))

    return str(file_path), extracted_text


async def process_document(file: UploadFile) -> str:
    """
    Validate, save, and extract text from an uploaded document.

    Returns:
        str: Extracted document text.
    """

    validate_file(file)

    _, extracted_text = await save_and_extract_text(file)

    if not extracted_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from the document"
        )

    return extracted_text
