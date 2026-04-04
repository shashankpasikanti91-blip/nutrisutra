"""
Temporary file handling utility.

Provides a context manager that writes bytes to a temp file and
guarantees cleanup.  Prefer working with in-memory bytes directly;
use this only when an external tool requires a file path.
"""

import os
import tempfile
from contextlib import contextmanager
from typing import Generator


@contextmanager
def temporary_image_file(
    file_bytes: bytes,
    suffix: str = ".tmp",
) -> Generator[str, None, None]:
    """Yield a temporary file path containing *file_bytes*.

    The file is deleted in the ``finally`` block even if the caller raises.
    """
    fd, path = tempfile.mkstemp(suffix=suffix)
    try:
        os.write(fd, file_bytes)
        os.close(fd)
        yield path
    finally:
        try:
            os.unlink(path)
        except OSError:
            pass
