# Build stage
FROM node:20 AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM oven/bun:1

WORKDIR /app

# Copy package.json untuk reference
COPY package.json ./

# Copy ONLY .output dan node_modules dari builder
# Ini memastikan semua dependencies yang dibutuhkan ada
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/node_modules /app/node_modules

# Expose port 3000 (internal container port)
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start with Bun runtime
CMD ["bun", "run", ".output/server/index.mjs"]