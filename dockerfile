############################################
# BUILD
############################################
FROM oven/bun:latest AS build
WORKDIR /app

COPY package.json bun.lock ./
COPY prisma ./prisma

RUN bun install

COPY . .

RUN bun run build

############################################
# RUNTIME
############################################
FROM oven/bun:latest
WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts

EXPOSE 3000

CMD ["sh", "-c", "bunx prisma generate && bunx prisma migrate deploy && bun run dist/index.js"]
