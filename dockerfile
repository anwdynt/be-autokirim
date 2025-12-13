FROM oven/bun:latest AS build
WORKDIR /app

COPY package.json bun.lock ./
COPY prisma ./prisma
RUN bun install

# prisma.config.ts dibaca di build
RUN bunx prisma generate

COPY . .
RUN bun build src/index.ts --compile --outfile dist/app

FROM oven/bun:latest
WORKDIR /app

COPY prisma ./prisma
COPY --from=build /app/dist/app ./app

EXPOSE 3000

CMD ["sh", "-c", "bunx prisma migrate deploy && ./app"]
