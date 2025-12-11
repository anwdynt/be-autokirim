# ===========================
# 1. Base image
# ===========================
FROM node:20-alpine AS base
WORKDIR /app

# ===========================
# 2. Install dependencies
# ===========================
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install
RUN npm install -D ts-node typescript

# ===========================
# 3. Build stage
# ===========================
FROM deps AS build
WORKDIR /app
COPY . .
RUN bun build src/index.ts --minify --sourcemap --outdir dist --target=bun --format=esm --entry-naming="[name].js"

# ===========================
# 4. Final Production Image
# ===========================
FROM oven/bun:1.1.20-alpine AS final
WORKDIR /app

# Install Node (Prisma membutuhkan Node, dan Bun crash)
RUN apk add --no-cache nodejs npm

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY prisma ./prisma
COPY src ./src

EXPOSE 3000

# Prisma Generate → Seed (ts-node) → Start App
CMD ["sh", "-c", "node node_modules/.bin/prisma generate && node --loader ts-node/esm src/config/seed.ts && bun run dist/index.js"]
