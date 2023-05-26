from docx.enum.table import WD_STYLE_TYPE
from docx import Document

def list_table_styles(doc):
    table_styles = doc.styles.get_table_styles()
    for style in table_styles:
        print(style.name)

# Load the document
doc = Document('path_to_your_document.docx')

# List the table styles
list_table_styles(doc)