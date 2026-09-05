from PIL import Image
import pytesseract


# Temporary local configuration for development
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


# Open the image
image = Image.open("sample_image.png")


# Extract text using OCR
text = pytesseract.image_to_string(image)


print("Extracted Text:")
print("-" * 50)
print(text)
