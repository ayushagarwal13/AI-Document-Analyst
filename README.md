# AI Document Analyst

AI Document Analyst is a full-stack Generative AI application that allows users to upload documents and perform AI-powered document analysis.

The application supports PDF, DOCX, PNG, JPG, and JPEG files and provides capabilities such as document question answering, summarization, analysis, classification, and structured invoice extraction.

The project combines document processing, OCR, Generative AI, structured data validation, and a React/FastAPI architecture into a single deployed application.

## Live Demo

- Frontend: https://ai-document-analyst.netlify.app
- Backend API: https://ai-document-analyst.onrender.com
- API Documentation (Swagger): https://ai-document-analyst.onrender.com/docs
- GitHub: https://github.com/ayushagarwal13/AI-Document-Analyst

> **Note:** The deployed application uses free-tier infrastructure and API quotas. Large scanned documents and high-resolution OCR workloads may take longer to process.

---

## Features

### Document Upload

Supports:

- PDF
- DOCX
- PNG
- JPG
- JPEG

Uploaded files are validated before processing.

### Ask Questions About Documents

Users can ask natural-language questions about an uploaded document.

The application extracts the document text and provides it to Gemini along with the user's question.

If the requested information is not present, the model is instructed to clearly state that the information is unavailable instead of inventing an answer.

### Document Summarization

Generates a concise summary while preserving important:

- Facts
- Names
- Dates
- Numbers
- Conclusions
- Key information

### Document Analysis

Generates useful analysis containing relevant sections such as:

1. Key findings
2. Important information
3. Potential concerns or missing information
4. Patterns or notable observations
5. Recommended actions or next steps

### Document Classification

Classifies documents into predefined categories:

- Invoice
- Receipt
- Resume
- Certificate
- Bank Statement
- Purchase Order
- Contract
- Report
- Letter
- Other

### Structured Invoice Extraction

Extracts structured information from one or more invoices, including:

- Vendor
- Invoice number
- Invoice date
- Subtotal
- Tax
- Total
- Currency

The LLM response is parsed as JSON and validated using Pydantic before being returned by the API.

### OCR Support

Supports OCR for:

- Images
- Scanned PDFs

Normal text-based PDFs use direct text extraction first, while OCR is used as a fallback when meaningful text cannot be extracted.

---

# Architecture

```text
                         User
                           |
                           v
                    React Frontend
                           |
                           | HTTP Request
                           v
                    FastAPI Backend
                           |
                           v
                   File Validation
                           |
                           v
                  Document Processor
                           |
          +----------------+----------------+
          |                |                |
          v                v                v
         PDF             DOCX            Images
          |                |                |
          v                v                v
      PyMuPDF          python-docx       RapidOCR
          |
          | No meaningful text
          v
       RapidOCR
          |
          +----------------+
                           |
                           v
                    Extracted Text
                           |
                           v
                    Gemini LLM
                           |
        +------------------+------------------+
        |                  |                  |
        v                  v                  v
   Ask Question       Summarization       Analysis
        |                  |                  |
        +------------------+------------------+
                           |
              +------------+------------+
              |                         |
              v                         v
        Classification          Invoice Extraction
                                        |
                                        v
                                JSON + Pydantic
                                  Validation
                                        |
                                        v
                                  API Response
                                        |
                                        v
                                  React Frontend
```

---

# Complete Processing Pipeline

```text
Upload Document
       |
       v
Validate File
       |
       v
Save Uploaded File
       |
       v
Identify File Type
       |
       +-------------------------------+
       |               |               |
       v               v               v
      PDF             DOCX           Image
       |               |               |
       v               v               v
   PyMuPDF        python-docx       RapidOCR
       |
       | Text unavailable?
       v
    RapidOCR
       |
       v
 Extracted Text
       |
       v
 Gemini
       |
       v
 Requested AI Operation
       |
       v
 Response
```

---

# Document Processing

## PDF Processing

PDF processing uses PyMuPDF.

The application first attempts direct text extraction from the PDF.

If no meaningful text is found, the PDF pages are rendered as images and processed using RapidOCR.

```text
PDF
 |
 v
PyMuPDF
 |
 +---- Text found ----> Return extracted text
 |
 +---- No meaningful text
             |
             v
            OCR
```

This approach avoids unnecessary OCR processing for PDFs that already contain machine-readable text.

## DOCX Processing

DOCX files are processed using `python-docx`.

The application extracts text from document paragraphs and passes the resulting text to the AI processing layer.

## Image Processing

PNG, JPG, and JPEG files are processed directly using RapidOCR.

```text
Image
  |
  v
RapidOCR
  |
  v
Extracted Text
```

---

# OCR Pipeline

The project uses RapidOCR for:

- Image OCR
- Scanned PDF OCR fallback

The OCR configuration was optimized for the memory constraints of the deployment environment.

The current configuration uses:

- Tiny detection model
- Tiny recognition model
- Maximum image side length of 1600 pixels
- Classification usage disabled
- ONNX Runtime CPU memory arena disabled

These optimizations were introduced after high-resolution OCR workloads caused memory exhaustion on the deployment environment.

---

# Generative AI

The project uses Google's Gemini API through the `google-genai` Python SDK.

## Model

**Gemini 3.6 Flash**

Gemini is used for:

- Question answering
- Summarization
- Document analysis
- Document classification
- Invoice data extraction

The API key is stored as an environment variable and is not exposed in the frontend.

---

# Prompt Engineering

The application uses task-specific prompts rather than sending the document to the model without instructions.

Prompts specify:

- The role of the AI
- The document content
- The user's question when applicable
- The expected output format
- Grounding requirements
- Instructions not to invent information
- Formatting requirements
- Classification categories
- Structured JSON requirements for invoice extraction

For document question answering, the model is instructed to answer primarily from the provided document and clearly indicate when information is unavailable.

---

# Grounding and Hallucination Handling

The application is designed to keep responses grounded in the uploaded document.

When information requested by the user is not present in the document, the model is instructed to say that the information is unavailable rather than fabricate an answer.

This behavior was explicitly tested using questions for information that was not present in uploaded documents.

---

# Prompt Injection Testing

Prompt injection was explicitly tested by embedding malicious instructions inside a document.

The test document contained legitimate invoice information as well as instructions attempting to make the model:

- Ignore previous instructions
- Reveal the system prompt
- Reveal the API key
- Reveal hidden instructions

The application was then asked normal questions about the invoice.

The model correctly answered the document-related questions and did not reveal the system prompt or API key.

> This testing does not claim complete protection against all possible prompt-injection attacks. Additional security controls would be required for a production-grade system.

---

# Structured Invoice Extraction

The invoice extraction workflow is:

```text
Document
    |
    v
Text Extraction
    |
    v
Gemini
    |
    v
JSON Response
    |
    v
json.loads()
    |
    v
Pydantic Validation
    |
    v
Validated InvoiceList
    |
    v
API Response
```

Example output:

```json
{
  "invoices": [
    {
      "vendor": "Example Vendor",
      "invoice_number": "INV-001",
      "invoice_date": "2026-01-01",
      "subtotal": 1000.0,
      "tax": 180.0,
      "total": 1180.0,
      "currency": "INR"
    }
  ]
}
```

The model is instructed to extract every distinct invoice present in the document.

---

# Pydantic Validation

Pydantic is used to validate structured invoice data generated by the LLM.

This provides a predictable structure for the API instead of directly returning unvalidated LLM output.

The validation layer helps ensure that the generated response conforms to the application's expected invoice schema.

---

# API Endpoints

| Endpoint | Purpose |
|---|---|
| `/ask` | Ask questions about an uploaded document |
| `/summarize` | Generate a document summary |
| `/analyze` | Generate document analysis |
| `/classify` | Classify the uploaded document |
| `/extract-invoice` | Extract structured invoice information |

Interactive API documentation is available through FastAPI Swagger UI.

---

# Tech Stack

## Frontend

- React
- JavaScript
- CSS

## Backend

- Python
- FastAPI
- Uvicorn

## Document Processing

- PyMuPDF
- python-docx
- Pillow

## OCR

- RapidOCR
- ONNX Runtime

## Generative AI

- Google Gemini
- `google-genai`

## Data Validation

- Pydantic

## Deployment

- Netlify — Frontend
- Render — Backend

---

# Why These Technologies?

### React

Provides a component-based frontend for interacting with the document analysis API.

### FastAPI

Provides:

- Simple API development
- Automatic request validation
- Swagger/OpenAPI documentation
- Strong integration with Python AI and document-processing libraries

### PyMuPDF

Provides direct text extraction from machine-readable PDFs and avoids unnecessary OCR processing.

### RapidOCR

Provides OCR for images and scanned documents without requiring a separate system-level Tesseract installation.

### Gemini

Provides the Generative AI capabilities required for:

- Document Q&A
- Summarization
- Analysis
- Classification
- Structured information extraction

### Pydantic

Provides schema validation for structured LLM output.

---

# Is This RAG?

No.

This project is a document-grounded Generative AI application, but it does not implement Retrieval-Augmented Generation.

The current pipeline is:

```text
Document
   |
   v
Text Extraction
   |
   v
Complete Extracted Text
   |
   v
Prompt
   |
   v
Gemini
   |
   v
Response
```

The project does not currently use:

- Embeddings
- Vector databases
- Semantic retrieval
- A retriever
- Chunk retrieval

A future RAG project can extend this concept by introducing document chunking, embeddings, vector storage, and retrieval.

---

# Project Structure

```text
AI-Document-Analyst/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   │
│   └── app/
│       ├── models/
│       │   ├── document_schemas.py
│       │   └── response_schemas.py
│       │
│       └── services/
│           ├── document_processor.py
│           ├── document_service.py
│           ├── file_validator.py
│           └── llm_service.py
│
├── data/
│   └── uploads/
│
├── evaluation/
│   └── evaluate.py.py
│
├── frontend/
│   └── src/
│       ├── App.jsx
│       └── App.css
│
├── .env.example
├── .gitignore
└── README.md
```

---

# Backend Architecture

### `main.py`

Defines the FastAPI application and API endpoints.

### `file_validator.py`

Validates uploaded files and checks supported content types.

### `document_processor.py`

Coordinates:

```text
Validation
   ↓
File Saving
   ↓
Text Extraction
```

### `document_service.py`

Contains document-specific extraction logic for:

- PDF
- DOCX
- Images
- OCR fallback

### `llm_service.py`

Contains the Gemini-powered AI operations:

- Question answering
- Summarization
- Analysis
- Classification
- Invoice extraction

### `document_schemas.py`

Contains Pydantic schemas related to structured document data.

### `response_schemas.py`

Contains API response schemas.

---

# Deployment Architecture

```text
                 Internet User
                       |
                       v
              Netlify Frontend
                       |
                       | HTTPS API Request
                       v
               Render Backend
                       |
          +------------+------------+
          |                         |
          v                         v
   Document Processing          Gemini API
          |                         |
          +------------+------------+
                       |
                       v
                 API Response
                       |
                       v
                React Frontend
```

The Gemini API key is kept on the backend as an environment variable and is not included in the frontend application.

---

# Environment Variables

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_api_key_here
```

Do not commit `.env` to Git.

The repository contains `.env.example` as a template.

---

# Running Locally

## 1. Clone the repository

```bash
git clone https://github.com/ayushagarwal13/AI-Document-Analyst.git
cd AI-Document-Analyst
```

## 2. Create a virtual environment

```bash
python -m venv .venv
```

### Windows PowerShell

```powershell
.\.venv\Scripts\Activate.ps1
```

## 3. Install backend dependencies

```bash
pip install -r backend/requirements.txt
```

## 4. Configure environment variables

Create `.env`:

```env
GEMINI_API_KEY=your_api_key_here
```

## 5. Start the backend

From the project root:

```bash
uvicorn backend.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger:

```text
http://127.0.0.1:8000/docs
```

## 6. Start the frontend

Navigate to the frontend directory and start the React development server using the project's frontend configuration.

---

# Testing

The application was tested across functional, edge-case, security, and deployment scenarios.

### Functional Testing

- PDF text extraction
- Scanned PDF OCR
- DOCX extraction
- Image OCR
- Document Q&A
- Document summarization
- Document analysis
- Document classification
- Multi-invoice extraction
- Large scanned PDF processing
- High-resolution image processing

### Grounding Testing

Questions were asked for information that was not present in the document.

The application correctly indicated when information was unavailable instead of fabricating an answer.

### Prompt Injection Testing

Documents containing malicious embedded instructions were tested.

The application continued to answer legitimate document questions without revealing protected instructions or API credentials.

### Error Testing

The following cases were tested:

- Unsupported file types
- Corrupted PDF
- Corrupted DOCX
- Empty file selection
- Empty question input

### Independent User Testing

The deployed application was independently tested by another user.

The application produced correct results across the tested workflows. Some large document summarization requests experienced high response latency.

---

# Production Challenges

## OCR Memory Usage

High-resolution OCR workloads caused memory exhaustion on the free Render deployment environment, which has a 512 MB memory constraint.

The OCR configuration was optimized using:

- Smaller OCR models
- Image-size limits
- Disabled classification usage
- ONNX Runtime memory configuration

The optimized configuration successfully handled the intended single-document high-resolution workflow.

However, repeated high-resolution OCR requests can still exceed the deployment memory constraint.

## Response Latency

Large scanned documents require:

```text
PDF processing
      ↓
Page rendering
      ↓
OCR
      ↓
Text preparation
      ↓
Gemini generation
      ↓
Response
```

This can result in significantly higher latency than processing a small text-based document.

The free Render deployment can also introduce cold-start latency after periods of inactivity.

## Gemini API Quota

The deployed application uses Gemini API quotas associated with the configured project.

Free-tier quota is not designed for unlimited public usage.

A production deployment serving a larger number of users would require appropriate API billing, quota management, and potentially additional architectural controls.

---

# Known Limitations

1. Large scanned documents can have high processing latency.
2. Repeated high-resolution OCR workloads can exceed the 512 MB memory limit of the current free deployment.
3. Gemini API free-tier quotas limit the number of requests that can be served.
4. The application currently sends extracted document text directly to the LLM rather than using retrieval.
5. Prompt-injection testing covered specific scenarios and does not guarantee protection against every possible attack.
6. The current deployment is intended primarily as a portfolio/demo application rather than a production-scale document processing service.

---

# Future Improvements

Potential improvements include:

- RAG-based document retrieval
- Document chunking
- Embedding-based semantic search
- Vector database integration
- Background document processing
- Asynchronous OCR jobs
- Queue-based processing
- Better caching
- Improved error classification
- More robust structured-output validation
- Authentication and authorization
- Usage and quota management
- Production-grade infrastructure
- Larger-memory compute for OCR workloads
- Automated evaluation and monitoring

---

# Security Considerations

- Gemini API credentials are stored server-side.
- API keys are not exposed to the frontend.
- Uploaded files are validated before processing.
- Unsupported file types are rejected.
- LLM prompts explicitly instruct the model not to invent information.
- Prompt-injection scenarios were tested.
- Sensitive credentials are excluded from version control through `.gitignore`.

---

# Project Goals

This project was built to demonstrate practical Generative AI application development beyond basic LLM prompting.

It combines:

```text
Full-Stack Development
        +
Document Processing
        +
OCR
        +
Generative AI
        +
Structured LLM Output
        +
Schema Validation
        +
API Development
        +
Cloud Deployment
        +
Production Testing
```

The project also provided practical experience with deployment constraints, OCR memory optimization, API quotas, document grounding, and prompt-injection testing.

---

# Author

**Ayush Agarwal**

GitHub: https://github.com/ayushagarwal13/AI-Document-Analyst

---

# License

This project is intended for educational and portfolio purposes.
