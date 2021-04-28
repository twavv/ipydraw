# ipydraw

Simple canvas for ipywidgets

# Installation

You can install using `pip`:

```bash
# Using pip
pip install ipydraw

# Using poetry
poetry add ipydraw
```

If you are using Jupyter Notebook 5.2 or earlier, you may also need to enable
the nbextension:
```bash
jupyter nbextension enable --py [--sys-prefix|--user|--system] ipydraw
```

# Usage

You can display the canvas in Jupyter frontends by creating a `Canvas` widget:
```python
import ipydraw
canvas = ipydraw.Canvas()
canvas
```

You can access the image data (as a data url) by examining the data attribute:
```python
print(canvas.data)
# data:image/png;base64,...
```

## Arguments
```python
# Default values shown below
ipydraw.Canvas(
    # The width of the strokes drawn on the Canvas
    line_width=10,
    
    # If true, enable drawing in multiple colors.
    # The user can pick the color before drawing each stroke.
    color=False,
    
    # The size (in pixels) of the canvas.
    size=(100, 100),
)
```

## Limitations
* It is not currently possible to set an initial image for the canvas.
* The canvas only supports syncing from the frontend (browser) to the kernel (Python).
* It is not possible to update any attributes (e.g., `size` or `line_width`) after the widget has been created.

## Usage with Pillow
To load the canvas image into a Python Pillow `Image`, we need to parse the data URL
(which is essentially a base64-encoded PNG image).

Make sure to install Pillow before continuing.
```sh
pip3 install Pillow
```

```python
import base64, io
from Pillow import Image

data_url = canvas.data

# Strip the data: url prefix to get just the base64 encoded PNG data
data_encoded = data_url[len('data:image/png;base64,'):]

# Get the raw PNG data
data_bin = base64.b64decode(data_encoded)

# Read the image into a Pillow Image.
# We use a BytesIO since Image.open expects a file-like object.
image_from_canvas = Image.open(io.BytesIO(data_bin))
```

# Development Installation

Create a dev environment:
```bash
conda create -n ipydraw-dev -c conda-forge nodejs yarn python jupyterlab
conda activate ipydraw-dev
```

Install the python. This will also build the TS package.
```bash
pip install -e ".[test, examples]"
```

When developing your extensions, you need to manually enable your extensions with the
notebook / lab frontend. For lab, this is done by the command:

```
jupyter labextension develop --overwrite .
yarn run build
```

For classic notebook, you need to run:

```
jupyter nbextension install --sys-prefix --symlink --overwrite --py ipydraw
jupyter nbextension enable --sys-prefix --py ipydraw
```

Note that the `--symlink` flag doesn't work on Windows, so you will here have to run
the `install` command every time that you rebuild your extension. For certain installations
you might also need another flag instead of `--sys-prefix`, but we won't cover the meaning
of those flags here.

## How to see your changes
### Typescript:
If you use JupyterLab to develop then you can watch the source directory and run JupyterLab at the same time in different
terminals to watch for changes in the extension's source and automatically rebuild the widget.

```bash
# Watch the source directory in one terminal, automatically rebuilding when needed
yarn run watch
# Run JupyterLab in another terminal
jupyter lab
```

After a change wait for the build to finish and then refresh your browser and the changes should take effect.

### Python:
If you make a change to the python code then you will need to restart the notebook kernel to have it take effect.
