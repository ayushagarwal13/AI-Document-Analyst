from pydantic import BaseModel

from backend.app.models.document_schemas import InvoiceList


class HomeResponse(BaseModel):
    message: str


class HealthResponse(BaseModel):
    status: str


class UploadResponse(BaseModel):
    filename: str
    content_type: str | None
    message: str
    extracted_text: str


class SummarizeResponse(BaseModel):
    filename: str
    message: str
    summary: str


class AskResponse(BaseModel):
    filename: str
    question: str
    answer: str


class AnalyzeResponse(BaseModel):
    filename: str
    message: str
    analysis: str


class ClassifyResponse(BaseModel):
    filename: str
    message: str
    document_type: str


class InvoiceExtractionResponse(BaseModel):
    filename: str
    message: str
    data: InvoiceList
