# ===============================
# 1. BASE IMAGE
# ===============================
FROM oven/bun:1.1.20-alpine AS base

WORKDIR /app

# ===============================
# 2. INSTALL DEPENDENCIES
# ===============================
FROM base AS deps

COPY bun.lockb package.json tsconfig.json ./

# Install all deps including ts-node
RUN bun install --frozen-lockfile

# ===============================
# 3. PRISMA BUILD
# ===============================
FROM deps AS prisma

COPY prisma ./prisma
RUN bunx prisma generate

# ===============================
# 4. BUILD APP
# ===============================
FROM base AS build

COPY --from=deps /app/node_modules ./node_modules
COPY --from=prisma /app/prisma ./prisma

COPY . .

# ===============================
# 5. RUNTIME STAGE
# ===============================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy app sources & node_modules
COPY --from=build /app . 

# =========================================
# Run migrations + seed on container start
# =========================================
CMD bunx prisma migrate deploy && \
    bun run seed && \
    bun run src/index.ts
