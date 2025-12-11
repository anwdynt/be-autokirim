###############################
# Base Image (Bun + Debian)
###############################
FROM oven/bun:1-debian AS base
WORKDIR /app

# Install SQL Server ODBC driver (Debian 12+ compatible)
RUN apt-get update \
    && apt-get install -y curl gnupg apt-transport-https ca-certificates \
    && curl https://packages.microsoft.com/keys/microsoft.asc \
        -o /etc/apt/trusted.gpg.d/microsoft.asc \
    && curl https://packages.microsoft.com/config/debian/12/prod.list \
        -o /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql18 unixodbc unixodbc-dev


###############################
# Dependencies Stage
###############################
FROM base AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile


###############################
# Build Stage
###############################
FROM base AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure Prisma client is generated for build platform
RUN bunx prisma generate

# Build your Bun project (to /dist folder)
RUN bun run build


###############################
# Production Stage
###############################
FROM base AS prod
WORKDIR /app

# Copy built app
COPY --from=build /app/dist ./dist

# Copy node_modules from deps
COPY --from=deps /app/node_modules ./node_modules

# Copy prisma schema (optional if runtime needed)
COPY prisma ./prisma

COPY package.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Start the production server
CMD ["bun", "run", "dist/index.js"]
