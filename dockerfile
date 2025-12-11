FROM oven/bun:1-debian AS base
WORKDIR /app

# Install SQL Server ODBC driver
RUN apt-get update \
    && apt-get install -y curl gnupg apt-transport-https ca-certificates \
    && curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - \
    && curl https://packages.microsoft.com/config/debian/12/prod.list \
         > /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql18 unixodbc unixodbc-dev

# Dependencies
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun build ./index.ts --outdir dist

# Production
FROM base AS prod
WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Prisma generate at RUNTIME (Coolify passes env here)
CMD ["sh", "-c", "bunx prisma generate && bun dist/index.js"]
