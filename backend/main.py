from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from backend.app.services.document_processor import process_document

from backend.app.models.response_schemas import (
    HomeResponse,
    HealthResponse,
    UploadResponse,
    SummarizeResponse,
    AskResponse,
    AnalyzeResponse,
    ClassifyResponse,
    InvoiceExtractionResponse,
)


from backend.app.services.llm_service import (
    analyze_document,
    ask_question_about_document,
    summarize_document,
    classify_document,
    extract_invoice_data,
)


app = FastAPI(
    title="AI Document Analyst API",
    description="An AI-powered API for analyzing documents using Gemini.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-document-analyst.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_model=HomeResponse)
def home():
    return {
        "message": "AI Document Analyst API is running successfully"
    }


@app.get("/health", response_model=HealthResponse)
def health_check():
    return {
        "status": "healthy"
    }


@app.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    try:
        extracted_text = await process_document(file)

        return {
            "filename": file.filename,
            "content_type": file.content_type,
            "message": "Document processed successfully",
            "extracted_text": extracted_text,
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing document: {str(e)}"
        )

    finally:
        await file.close()


@app.post("/summarize", response_model=SummarizeResponse)
async def summarize_uploaded_document(
    file: UploadFile = File(...)
):
    try:
        # Step 1: Validate, save, and extract text
        extracted_text = await process_document(file)

        # Step 2: Generate summary using Gemini
        summary = summarize_document(extracted_text)

        # Step 3: Return the result
        return {
            "filename": file.filename,
            "message": "Document summarized successfully",
            "summary": summary
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error summarizing document: {str(e)}"
        )

    finally:
        await file.close()


@app.post("/ask", response_model=AskResponse)
async def ask_question(
    file: UploadFile = File(...),
    question: str = Form(...)
):
    try:
        # Step 1: Validate, save, and extract text
        extracted_text = await process_document(file)

        # Step 2: Ask Gemini a question about the document
        answer = ask_question_about_document(
            extracted_text,
            question
        )

        # Step 3: Return the answer
        return {
            "filename": file.filename,
            "question": question,
            "answer": answer
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error answering question: {str(e)}"
        )

    finally:
        await file.close()


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze_uploaded_document(file: UploadFile = File(...)):
    try:
        extracted_text = await process_document(file)
        analysis = analyze_document(extracted_text)

        return {
            "filename": file.filename,
            "message": "Document analyzed successfully",
            "analysis": analysis
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing document: {str(e)}"
        )

    finally:
        await file.close()


@app.post("/classify", response_model=ClassifyResponse)
async def classify_uploaded_document(file: UploadFile = File(...)):
    try:
        extracted_text = await process_document(file)
        document_type = classify_document(extracted_text)

        return {
            "filename": file.filename,
            "message": "Document classified successfully",
            "document_type": document_type
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error classifying document: {str(e)}"
        )

    finally:
        await file.close()


@app.post("/extract-invoice", response_model=InvoiceExtractionResponse)
async def extract_invoice(file: UploadFile = File(...)):
    try:
        extracted_text = await process_document(file)
        invoice_data = extract_invoice_data(extracted_text)

        return {
            "filename": file.filename,
            "message": "Invoice data extracted successfully",
            "data": invoice_data
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error extracting invoice data: {str(e)}"
        )

    finally:
        await file.close()
