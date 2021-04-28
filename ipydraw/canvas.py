#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Travis DePrato.
# Distributed under the terms of the Modified BSD License.

from ipywidgets import DOMWidget
from traitlets import Unicode, Int, Tuple, Any, Bool
from ._frontend import module_name, module_version


class Canvas(DOMWidget):
    """
    A simple Canvas widget.
    """
    _model_name = Unicode('CanvasModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('CanvasView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    data = Unicode(
        default_value="",
        help=(
            "The data URL of the image that has been drawn on the frontend. "
            "This is usually of the format `data:image/png;base64,` followed "
            "by a base64-encoded PNG image."
        ),
    ).tag(sync=True)

    color = Bool(
        default_value=False,
        help=(
            "If True, enabled drawing in a frontend-selected color; otherwise, "
            "all strokes are drawn in black."
        ),
    ).tag(sync=True)

    size = Tuple(
        Int(), Int(),
        default_value=(200, 200),
        help=(
            "The size in pixels of the canvas."
        ),
    ).tag(sync=True)

    line_width = Int(
        default_value=10,
        help=(
            "The width of strokes drawn on the canvas."
        ),
    ).tag(sync=True)

    path = Any(
        default_value=[],
        help=(
            "Used to store data for the frontend, the data format is defined "
            "by the frontend code. This should NOT be considered part of the "
            "public API of the widget."
        ),
    ).tag(sync=True)
