# ===========================
# 1. Base Image
# ===========================
FROM oven/bun:1.1.20-alpine AS base
WORKDIR /app

# ===========================
# 2. Install Dependencies
# ===========================
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install

# ===========================
# 3. Build Stage
# ===========================
FROM deps AS build
COPY . .
RUN bunx prisma generate
RUN bun build src/index.ts --target=bun --outdir --minify --sourcemap

# ===========================
# 4. Production Dependencies
# ===========================
FROM base AS prod-deps
COPY package.json bun.lock ./
RUN bun install --production

COPY prisma ./prisma
RUN bunx prisma generate

# ===========================
# 5. Final Image
# ===========================
FROM base AS final
WORKDIR /app

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY prisma ./prisma

EXPOSE 3000

CMD ["bun", "run", "dist/index.js"]
