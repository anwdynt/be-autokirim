############################################
# BUILD STAGE
############################################
FROM oven/bun:latest AS build
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

# build binary
RUN bun run build:execute



############################################
# PRODUCTION STAGE
############################################
FROM oven/bun:latest AS production
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --production

COPY prisma ./prisma
COPY --from=build /app/dist/app ./app

EXPOSE 3000

CMD ["sh", "-c", "bunx prisma generate && bunx prisma migrate deploy && ./app"]



