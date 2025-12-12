FROM oven/bun:latest AS build
WORKDIR /app

COPY package.json bun.lock ./
COPY prisma ./prisma

RUN bun install --frozen-lockfile
RUN bunx prisma generate

COPY . .

RUN bun run build:execute


FROM oven/bun:latest AS production
WORKDIR /app

# Copy prisma (schema + client)
COPY --from=build /app/prisma ./prisma

# Copy dist/app binary
COPY --from=build /app/dist/app ./app

EXPOSE 3000

# Migrate DB → run binary
CMD sh -c "bunx prisma migrate deploy && ./app"
