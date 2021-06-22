import base64
import io
import typing as T

from PIL import Image


def load_image(img) -> "Image":
    # Check if img satisfies the image interface
    if hasattr(img, "save") and hasattr(img, "copy") and hasattr(img, "format"):
        return img
    return Image.open(img)


def image_to_b64(img, format=None) -> T.Tuple[str, str]:
    """
    Calculate the base64 encoding of the image.

    The return value is a tuple whose first value is the format that was used to
    encode the image (e.g., ``png`` or ``jpeg``) and whose second value is the
    string containing the base64-encoded image data in that format.

    If format is given, that format is used to save the image; otherwise, the
    format is auto-detected from the image if possible (defaulting to ``jpeg``
    if not possible).
    """
    img = load_image(img)
    format = format or (img.format and img.format.lower()) or "jpeg"
    buf = io.BytesIO()
    img.save(buf, format=format)
    return format, base64.b64encode(buf.getvalue()).decode()


def image_to_dataurl(img, format=None) -> str:
    """
    Calculate a data URL for the given image.

    This value can be used as the ``src`` of an image and is useful to transmit
    the image data from the Python process to the browser without having to save
    the image to disk.
    """
    format, payload = image_to_b64(img, format)
    return f"data:image/{format};base64,{payload}"
