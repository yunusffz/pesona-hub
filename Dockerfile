# Build stage dengan Bun
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install ALL dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN bun run build

# Production stage
FROM oven/bun:1-alpine

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