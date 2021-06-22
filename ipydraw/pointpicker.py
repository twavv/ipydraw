#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Travis DePrato.
# Distributed under the terms of the Modified BSD License.

import typing as T

from PIL import Image
from ipywidgets import DOMWidget
from traitlets import Unicode, Int, Tuple, Any, Bool

from .utils import image_to_dataurl
from ._frontend import module_name, module_version


class PointPicker(DOMWidget):
    """
    A simple Canvas widget.
    """
    _model_name = Unicode('PointPickerModel').tag(sync=True)
    _model_module = Unicode(module_name).tag(sync=True)
    _model_module_version = Unicode(module_version).tag(sync=True)
    _view_name = Unicode('PointPickerView').tag(sync=True)
    _view_module = Unicode(module_name).tag(sync=True)
    _view_module_version = Unicode(module_version).tag(sync=True)

    @classmethod
    def for_image(cls, img: T.Union["Image", str], format=None, **kwargs):
        return cls(
            image_src=image_to_dataurl(img, format),
            **kwargs,
        )

    image_src = Unicode(
        default_value="",
        help=(
            "The src of the image that has been drawn on the frontend. "
            "This is usually of the format `data:image/png;base64,` followed "
            "by a base64-encoded PNG image."
        ),
    ).tag(sync=True)

    n_points = Int(
        default_value=None,
        allow_none=True,
        help=(
            "The number of points to allow to be drawn. "
            "A value of `None` means there is no maximum number of points."
        ),
    ).tag(sync=True)

    points = Any(
        default_value=[],
        help=(
            "An array of points (represented as `(x, y)` tuples)."
        ),
    ).tag(sync=True)

    def get_points(self):
        """
        Get the list of all points that have been selected.

        Raises a ValueError if ``n_points`` is not None but fewer points have
        been selected.
        """
        if self.n_points and len(self.points) != self.n_points:
            raise ValueError(f"Expected {self.n_points} points to be selected")
        return self.points
