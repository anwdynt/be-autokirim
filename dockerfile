# =========================
# Stage 1: Install dependencies
# =========================
FROM oven/bun:latest AS deps
WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile


# =========================
# Stage 2: Build application
# =========================
FROM oven/bun:latest AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate prisma client
RUN bunx prisma generate

# Build your app
RUN bun build src/index.ts --outdir dist --minify --sourcemap --target=bun --format=esm


# =========================
# Stage 3: Production
# =========================
FROM oven/bun:latest AS prod
WORKDIR /app

# Copy built artifacts
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
COPY package.json ./ 

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "dist/index.js"]
