# Base image menggunakan Debian 12 (bookworm)
FROM oven/bun:1-bookworm AS base
WORKDIR /app

# Install SQL Server ODBC driver (msodbcsql18) – fully supported by Debian 12
RUN apt-get update \
    && apt-get install -y curl gnupg ca-certificates apt-transport-https \
    && curl https://packages.microsoft.com/keys/microsoft.asc \
        -o /etc/apt/trusted.gpg.d/microsoft.asc \
    && curl https://packages.microsoft.com/config/debian/12/prod.list \
        -o /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql18 unixodbc unixodbc-dev \
    && apt-get clean

# Dependencies
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production
FROM base AS prod
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
COPY package.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Prisma generate (wajib, karena lingkungan berbeda)
CMD ["sh", "-c", "bunx prisma generate && bun dist/index.js"]
