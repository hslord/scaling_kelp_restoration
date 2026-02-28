#!/usr/bin/env bash
set -e

echo "=== Kelp Restoration Model — Setup ==="
echo ""

# Check for Node.js
if ! command -v node &>/dev/null; then
  echo "Error: Node.js is not installed."
  echo "Install it from https://nodejs.org (v18+ required)"
  exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "Error: Node.js v18+ required (found v$(node -v))"
  exit 1
fi

echo "Node.js $(node -v) detected"

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

# Build check
echo ""
echo "Running build check..."
npm run build

echo ""
echo "=== Setup complete ==="
echo ""
echo "To start the dev server:"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000"
