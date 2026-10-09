#!/bin/bash
cd "$(dirname "$0")"
source .venv/bin/activate
echo "Starting Student Performance API on http://localhost:8000"
echo "Interactive Swagger Docs: http://localhost:8000/docs"
uvicorn main:app --reload --port 8000
