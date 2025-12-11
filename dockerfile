# ===========================
# 1. Base image
# ===========================
FROM oven/bun:1.1.20-alpine AS base
WORKDIR /app

# ===========================
# 2. Dependencies
# ===========================
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install

# ===========================
# 3. Build stage
# ===========================
FROM deps AS build
WORKDIR /app
COPY . .
RUN bun build src/index.ts --target=bun --outdir dist --no-bundle

# ===========================
# 4. Final Production
# ===========================
FROM oven/bun:1.1.20-alpine AS final
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY prisma ./prisma

EXPOSE 3000

# ===========================
# 5. Runtime command:
# prisma generate → seed → start app
# ===========================
CMD ["sh", "-c", "bunx prisma generate && bunx ts-node src/config/seed.ts && bun run dist/index.js"]
