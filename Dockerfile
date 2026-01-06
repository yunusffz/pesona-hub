# =====================
# Build stage
# =====================
FROM node:20.19.6-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy all source files
COPY . .

# Generate Nuxt TypeScript config (PENTING!)
RUN npm run prepare || npx nuxt prepare

# Build Nuxt
RUN npm run build

# =====================
# Runtime stage
# =====================
FROM node:20-alpine

WORKDIR /app

# Copy build output
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

# Non-root user
RUN addgroup -g 1001 -S nodejs \
 && adduser -S nuxt -u 1001 \
 && chown -R nuxt:nodejs /app

USER nuxt

EXPOSE 3000

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000

CMD ["node", ".output/server/index.mjs"]