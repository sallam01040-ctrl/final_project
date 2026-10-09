#!/bin/bash
# EduScore Analytics - Quick Dev Launcher
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "============================================="
echo "   EduScore Analytics - Local Development    "
echo "============================================="
echo "1) Start FastAPI Backend (port 8000)"
echo "2) Start Next.js Frontend (port 3000)"
echo "3) Start Both concurrently"
echo "============================================="

CHOICE=${1:-"3"}

if [ "$CHOICE" == "1" ]; then
    echo "Starting FastAPI Backend..."
    cd "$DIR/backend"
    source .venv/bin/activate
    uvicorn main:app --reload --port 8000
elif [ "$CHOICE" == "2" ]; then
    echo "Starting Next.js Frontend..."
    cd "$DIR/frontend"
    npm run dev
elif [ "$CHOICE" == "3" ]; then
    echo "Starting FastAPI Backend in background..."
    cd "$DIR/backend"
    source .venv/bin/activate
    uvicorn main:app --reload --port 8000 &
    BACKEND_PID=$!
    
    echo "Starting Next.js Frontend..."
    cd "$DIR/frontend"
    
    trap "kill $BACKEND_PID 2>/dev/null || true" EXIT
    npm run dev
fi
