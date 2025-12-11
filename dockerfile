# =========================
# 1. Builder phase
# =========================
FROM node:20-slim as builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Hanya build TS → JANGAN prisma generate di sini
RUN npm run build

# =========================
# 2. Final production
# =========================
FROM node:20-slim
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

# Prisma generate dilakukan saat container START (ENV sudah ada)
CMD ["sh", "-c", "npx prisma generate && node dist/index.js"]
