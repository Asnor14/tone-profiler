import docx
import io

def parse_txt(file_content: bytes) -> str:
    """Parses text from a .txt file bytes"""
    try:
        return file_content.decode('utf-8')
    except UnicodeDecodeError:
        # Fallback to latin-1 if utf-8 fails
        return file_content.decode('latin-1')

def parse_docx(file_content: bytes) -> str:
    """Parses text from a .docx file bytes"""
    try:
        doc = docx.Document(io.BytesIO(file_content))
        full_text = []
        for para in doc.paragraphs:
            full_text.append(para.text)
        return '\n'.join(full_text)
    except Exception as e:
        raise ValueError(f"Error parsing .docx file: {str(e)}")

def file_to_text(filename: str, content: bytes) -> str:
    """Determines parser based on filename extension and returns text"""
    if filename.lower().endswith('.txt'):
        return parse_txt(content)
    elif filename.lower().endswith('.docx'):
        return parse_docx(content)
    else:
        raise ValueError("Unsupported file format. Please upload .txt or .docx")
