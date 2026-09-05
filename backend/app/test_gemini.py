import os

from dotenv import load_dotenv
from google import genai
from google.genai import types

from backend.app.models.document_schemas import Invoice


# Load variables from .env
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY was not found in .env")


# Create Gemini client
client = genai.Client(api_key=api_key)


# Sample unstructured invoice text
invoice_text = """
Invoice

Vendor: ABC Technologies
Invoice Number: INV-2026-1024
Invoice Date: 2026-08-10

Service:
AI Consulting: 45000 INR

Tax: 8100 INR

Total: 53100 INR
"""


# Ask Gemini to extract structured information
response = client.models.generate_content(
    model="gemini-3.6-flash",
    contents=f"""
Extract the invoice information from the text below.

{invoice_text}
""",
    config=types.GenerateContentConfig(
        response_mime_type="application/json",
        response_json_schema=Invoice.model_json_schema(),
    ),
)


# Validate Gemini's JSON response using Pydantic
invoice = Invoice.model_validate_json(response.text)


print("Validated Invoice:")
print(invoice)

print("\nValidated JSON:")
print(invoice.model_dump_json(indent=2))
