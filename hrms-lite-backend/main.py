# This file is for Render deployment compatibility
# Render runs: uvicorn main:app
# This imports the app from app.main module
from app.main import app

__all__ = ["app"]

