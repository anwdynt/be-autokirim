############################################
# BUILD STAGE (no prisma generate here!)
############################################
FROM oven/bun:latest AS build
WORKDIR /app

COPY package.json bun.lock ./
COPY prisma ./prisma

RUN bun install --frozen-lockfile
RUN bunx prisma generate  
COPY . .

# Build binary
RUN bun run build:execute


############################################
# PRODUCTION STAGE
############################################
FROM oven/bun:latest AS production
WORKDIR /app

# Copy prisma schema
COPY prisma ./prisma

# Copy binary
COPY --from=build /app/dist/app ./app

EXPOSE 3000

# ON RUNTIME (env available): generate -> migrate -> run
CMD sh -c "bunx prisma migrate deploy && ./app"
