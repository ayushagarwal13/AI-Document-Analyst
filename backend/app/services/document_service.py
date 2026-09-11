from pathlib import Path

import fitz
from PIL import Image
from docx import Document
from rapidocr import ModelType, RapidOCR


IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg"}

SUPPORTED_EXTENSIONS = {
    ".pdf",
    ".docx",
    ".png",
    ".jpg",
    ".jpeg",
}

ocr = RapidOCR(
    params={
        "Global.use_cls": False,
        "Global.max_side_len": 1600,
        "Det.model_type": ModelType.TINY,
        "Rec.model_type": ModelType.TINY,
        "EngineConfig.onnxruntime.enable_cpu_mem_arena": False,
    }
)


def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from a PDF.

    First tries direct text extraction using PyMuPDF.
    If no meaningful text is found, uses OCR on PDF pages.
    """

    document = fitz.open(file_path)

    extracted_text = ""

    # First attempt: direct text extraction
    for page in document:
        extracted_text += page.get_text()

    # If meaningful text was found, return it
    if extracted_text.strip():
        document.close()
        return extracted_text

    # Fallback: OCR for scanned PDFs
    ocr_text = ""

    for page in document:
        pix = page.get_pixmap()

        image = Image.frombytes(
            "RGB",
            [pix.width, pix.height],
            pix.samples
        )

        result = ocr(
            image,
            use_det=True,
            use_cls=False,
            use_rec=True
        )

        page_text = ""

        if result.txts is not None:
            page_text = "\n".join(result.txts)

        ocr_text += page_text + "\n"

    document.close()

    return ocr_text


def extract_text_from_image(file_path: str) -> str:
    """
    Extract text from an image using RapidOCR.
    """

    result = ocr(
        file_path,
        use_det=True,
        use_cls=False,
        use_rec=True
    )

    if result.txts is None:
        return ""

    return "\n".join(result.txts)


def extract_text_from_docx(file_path: str) -> str:
    """
    Extract text from a DOCX file.
    """

    document = Document(file_path)

    extracted_text = ""

    for paragraph in document.paragraphs:
        extracted_text += paragraph.text + "\n"

    return extracted_text


def extract_text_from_document(file_path: str) -> str:
    """
    Validate the file and extract text using
    the appropriate processing method.
    """

    path = Path(file_path)

    # Check whether the file exists
    if not path.exists():
        raise FileNotFoundError(
            f"File not found: {file_path}"
        )

    file_extension = path.suffix.lower()

    # Check whether the file type is supported
    if file_extension not in SUPPORTED_EXTENSIONS:
        raise ValueError(
            f"Unsupported file type: {file_extension}. "
            f"Supported types are: {SUPPORTED_EXTENSIONS}"
        )

    if file_extension == ".pdf":
        return extract_text_from_pdf(file_path)

    if file_extension == ".docx":
        return extract_text_from_docx(file_path)

    if file_extension in IMAGE_EXTENSIONS:
        return extract_text_from_image(file_path)

    raise ValueError(
        f"Unable to process file: {file_path}"
    )
