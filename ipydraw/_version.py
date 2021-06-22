#!/usr/bin/env python
# coding: utf-8

# Copyright (c) Travis DePrato.
# Distributed under the terms of the Modified BSD License.

version_info = (0, 2, 2)

# For pre-release versions, use a7 format (for alpha.7)
# For release versions, this should be empty.
# MAKE SURE TO KEEP THIS IN SYNC WITH THE package.json FILE.
version_suffix = ""

__version__ = ".".join(map(str, version_info)) + version_suffix
