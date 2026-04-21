#!/bin/bash

# Navigate to project directory
cd "$(dirname "$0")"

# Start Next.js 15 dev server
# Uses absolute path to avoid nvm PATH issues
/Users/jameshe/.nvm/versions/node/v24.13.1/bin/node node_modules/.bin/next dev
