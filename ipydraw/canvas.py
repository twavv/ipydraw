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

    data = Unicode('data').tag(sync=True)
    color = Bool('color').tag(sync=True)
    size = Tuple(Int(200), Int(200)).tag(sync=True)
    line_width = Int(20).tag(sync=True)

    # Used to store data for the frontend, the data format is defined by the
    # frontend code. This should NOT be considered part of the public API of
    # the widget.
    path = Any([]).tag(sync=True)
