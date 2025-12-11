FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --production=false

COPY . .

RUN bunx prisma generate

RUN bun build src/index.ts --outdir dist --minify --sourcemap --target=bun --format=esm


FROM oven/bun:1 AS production

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

CMD ["bun", "dist/index.js"]
