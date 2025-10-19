# Base Playwright (Chromium já incluído)
FROM mcr.microsoft.com/playwright:v1.46.0-jammy

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Install Playwright browsers (if not already installed)
RUN npx playwright install --with-deps chromium

# Copy source code
COPY . .

# Build the extension
RUN node scripts/build-extension.mjs

# Default command
CMD ["npm", "test"]
