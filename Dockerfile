# =====================
# Build stage
# =====================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy lock file dulu agar cache optimal
COPY package.json package-lock.json ./

# Install dependency sesuai lock
RUN npm ci

# Copy source code
COPY . .

# Build Nuxt
RUN npm run build


# =====================
# Runtime stage
# =====================
FROM node:20-alpine

WORKDIR /app

# Copy build output
COPY --from=builder /app/.output ./.output

# Copy production deps
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Non-root user (security best practice)
RUN addgroup -g 1001 -S nodejs \
 && adduser -S nuxt -u 1001

RUN chown -R nuxt:nodejs /app
USER nuxt

EXPOSE 3000

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", ".output/server/index.mjs"]
