# Build stage dengan Bun (TERCEPAT!)
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install dependencies dengan Bun
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN bun run build

# Production stage
FROM oven/bun:1-alpine

WORKDIR /app

# Copy package files
COPY package.json bun.lockb* ./

# Install production dependencies only
RUN bun install --production --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/.output /app/.output

# Expose port 3000 (internal container port)
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start with Bun runtime (lebih cepat dari Node!)
CMD ["bun", "run", ".output/server/index.mjs"]