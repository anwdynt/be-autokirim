# =========================
# Stage 1: Install ODBC driver (Ubuntu)
# =========================
FROM ubuntu:22.04 AS odbc-stage

# Install dependencies dasar + ODBC
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    apt-transport-https \
    unixodbc \
    unixodbc-dev \
    libssl-dev \
    libkrb5-3 \
    libgssapi-krb5-2 \
    libcurl4 \
    libc6 \
    && curl https://packages.microsoft.com/keys/microsoft.asc \
        -o /etc/apt/trusted.gpg.d/microsoft.asc \
    && curl https://packages.microsoft.com/config/ubuntu/22.04/prod.list \
        -o /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y msodbcsql18 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Pastikan library ODBC tersedia
RUN ldconfig

# =========================
# Stage 2: Dependencies Bun
# =========================
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# =========================
# Stage 3: Build project
# =========================
FROM oven/bun:1 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# =========================
# Stage 4: Production image
# =========================
FROM oven/bun:1 AS prod
WORKDIR /app

# Copy ODBC driver dan library dari stage sebelumnya
COPY --from=odbc-stage /opt/microsoft/msodbcsql18 /opt/microsoft/msodbcsql18
COPY --from=odbc-stage /usr/lib/x86_64-linux-gnu /usr/lib/x86_64-linux-gnu
COPY --from=odbc-stage /lib/x86_64-linux-gnu /lib/x86_64-linux-gnu
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
COPY package.json ./

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Prisma generate + run server
CMD ["sh", "-c", "bunx prisma generate && bun dist/index.js"]
