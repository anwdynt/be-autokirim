############################################
# BUILD STAGE
############################################
FROM oven/bun:latest AS build
WORKDIR /app

# Copy only essential first (layer optimization)
COPY package.json bun.lock ./

# Copy prisma schema + config
COPY prisma ./prisma
COPY prisma.config.ts ./

# Install dependencies
RUN bun install --frozen-lockfile

# Generate Prisma Client
RUN bunx prisma generate

# Copy source code
COPY . .

# Build to single binary
RUN bun run build:execute


############################################
# PRODUCTION STAGE
############################################
FROM oven/bun:latest AS production
WORKDIR /app

# Copy prisma (schema + generated client)
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma

# Copy binary
COPY --from=build /app/dist/app ./app

EXPOSE 3000

CMD sh -c "bunx prisma migrate deploy && ./app"
