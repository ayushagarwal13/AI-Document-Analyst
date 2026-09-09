import json
import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

from backend.app.models.document_schemas import InvoiceList


load_dotenv()


api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in the .env file")


retry_options = types.HttpRetryOptions(
    attempts=3,
    initial_delay=2.0,
    max_delay=10.0,
    http_status_codes=[429, 500, 502, 503, 504],
)


client = genai.Client(
    api_key=api_key,
    http_options=types.HttpOptions(
        retry_options=retry_options
    )
)


def ask_question_about_document(
    document_text: str,
    question: str
) -> str:
    """
    Send document text and a user question to Gemini
    and return the generated answer.
    """

    prompt = f"""
You are an AI document analyst.

Answer the user's question using the document provided below.

DOCUMENT:
{document_text}

USER QUESTION:
{question}

Instructions:
- Answer clearly and accurately.
- Base your answer primarily on the provided document.
- If the answer is not available in the document, clearly say so.
- Return the answer as clean plain text.
- Do not use Markdown formatting.
- Do not use #, *, **, backticks, or Markdown bullet points.
- Use simple numbered lists or plain text when listing information.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    return response.text


def summarize_document(document_text: str) -> str:
    """
    Generate a concise summary of the provided document.
    """

    prompt = f"""
You are an AI document analyst.

Analyze the document provided below and create a clear,
concise summary.

Focus on the most important information. Preserve important
facts, names, dates, numbers, and conclusions when they are
present in the document.

DOCUMENT:
{document_text}

Return the answer as clean plain text.

Do not use Markdown formatting.
Do not use #, *, **, backticks, or Markdown bullet points.
Use simple headings and numbered sections where appropriate.
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    return response.text


def extract_invoice_data(document_text: str) -> InvoiceList:
    """
    Extract one or more invoices from document text using Gemini
    and validate the result using Pydantic.
    """

    prompt = f"""
You are an AI document analyst.

Analyze the complete document and extract information for EVERY
invoice present in the document.

Return ONLY valid JSON in exactly this format:

{{
    "invoices": [
        {{
            "vendor": "string",
            "invoice_number": "string",
            "invoice_date": "string",
            "subtotal": 0.0,
            "tax": 0.0,
            "total": 0.0,
            "currency": "string"
        }}
    ]
}}

Rules:
- Extract EVERY distinct invoice found in the document.
- Each invoice must be a separate object inside the "invoices" list.
- Do not include Markdown.
- Do not include explanations.
- Return only the JSON object.
- Use numbers for subtotal, tax, and total.
- Do not invent information.
- If a field cannot be found, use null.

DOCUMENT:
{document_text}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    invoice_data = json.loads(response.text)

    validated_invoices = InvoiceList(**invoice_data)

    return validated_invoices


def classify_document(document_text: str) -> str:
    """
    Classify the type of document using Gemini.
    """

    prompt = f"""
You are an AI document classification system.

Analyze the document below and identify its primary document type.

Choose the most appropriate category from:

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

Important classification rules:

- Invoice: A document that lists goods or services, prices, quantities,
  invoice/reference number, invoice date, subtotal, tax, discount, or
  total amount due. An invoice may also contain payment information such
  as "Received" or "Paid".
- Receipt: A document whose primary purpose is to confirm that a payment
  or purchase has already been completed. Do not classify an itemized
  invoice as a receipt simply because it contains words such as
  "Received" or "Paid".
- If the document contains clear invoice identifiers and itemized
  charges, prefer Invoice over Receipt.

Return ONLY the category name.
Do not provide an explanation.
Do not use Markdown.

DOCUMENT:
{document_text}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    return response.text.strip()


def analyze_document(document_text: str) -> str:
    """
    Analyze a document and generate key insights,
    important findings, potential concerns, and recommendations.
    """

    prompt = f"""
You are an expert AI document analyst.

Analyze the document provided below and generate useful insights.

Your analysis should include, where relevant:

1. Key findings
2. Important information
3. Potential concerns or missing information
4. Patterns or notable observations
5. Recommended actions or next steps

Rules:
- Base the analysis on the provided document.
- Do not invent facts that are not supported by the document.
- If a section is not relevant to the document, omit it.
- Clearly distinguish facts from recommendations or interpretations.
- Return the response as clean plain text.
- Do not use Markdown formatting.
- Do not use #, *, **, backticks, or Markdown bullet points.
- Use simple numbered sections and numbered lists where appropriate.

DOCUMENT:
{document_text}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt,
    )

    return response.text
