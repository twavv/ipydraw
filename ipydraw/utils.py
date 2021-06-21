import base64
import io

from PIL import Image


def load_image(img) -> "Image":
    # Check if img satisfies the image interface
    if hasattr(img, "save") and hasattr(img, "copy") and hasattr(img, "format"):
        return img
    return Image.open(img)


def image_to_b64(img, format=None) -> str:
    img = load_image(img)
    if not format:
        format = img.format
    buf = io.BytesIO()
    img.save(buf, format=format)
    return base64.b64encode(buf.getvalue()).decode()


def image_to_dataurl(img, format=None) -> str:
    img = load_image(img)
    if not format:
        format = img.format.lower()
    return f"data:image/{format};base64,{image_to_b64(img)}"
