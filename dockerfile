# ===========================
# 1. Base image
# ===========================
FROM node:20-alpine AS base
WORKDIR /app

# ===========================
# 2. Install dependencies
# ===========================
COPY package.json package-lock.json ./
RUN npm install

# ===========================
# 3. Build TypeScript
# ===========================
FROM base AS build
WORKDIR /app
COPY . .
RUN npx tsc

# ===========================
# 4. Final Production Image
# ===========================
FROM node:20-alpine AS final
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY prisma ./prisma

EXPOSE 3000

# Prisma → Seed → Start
CMD ["sh", "-c", "npx prisma generate && node dist/index.js"]
