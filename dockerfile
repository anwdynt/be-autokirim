# ===========================
# 1. Build Executable Binary
# ===========================
FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .

RUN bunx prisma generate

# Build single binary
RUN bun build src/index.ts --compile --outfile app

# ===========================
# 2. Final Image for Coolify
# ===========================
FROM alpine:3.19 AS final

WORKDIR /app

RUN apk add --no-cache \
    libstdc++ \
    ca-certificates

# Copy binary
COPY --from=builder /app/app ./app

COPY prisma ./prisma
COPY .env .env

EXPOSE 3000
CMD ["./app"]
