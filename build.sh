#!/bin/bash

# Borouge ESG Intelligence Platform - Vercel Build Script
echo "🚀 Starting Borouge ESG Intelligence Platform build..."

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Build frontend
echo "🔨 Building frontend..."
npm run build

echo "✅ Build completed successfully!"
