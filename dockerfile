# =========================
# Stage 1: Install ODBC driver (Ubuntu 22.04)
# =========================
FROM ubuntu:22.04 AS odbc-stage

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

RUN ldconfig


# =========================
# Stage 2: Dependencies Bun
# =========================
FROM oven/bun:1 AS deps
WORKDIR /app
COPY bun.lock package.json ./
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
# Stage 4: Final Production Image (Debian 13 + ODBC)
# =========================
FROM oven/bun:1 AS prod
WORKDIR /app

# Copy only *required* ODBC libs (NO GLIBC)
COPY --from=odbc-stage /opt/microsoft/msodbcsql18 /opt/microsoft/msodbcsql18

# unixODBC core
COPY --from=odbc-stage /usr/lib/x86_64-linux-gnu/libodbc.so.2 /usr/lib/x86_64-linux-gnu/
COPY --from=odbc-stage /usr/lib/x86_64-linux-gnu/libodbcinst.so.2 /usr/lib/x86_64-linux-gnu/

# Microsoft ODBC Driver for SQL Server
COPY --from=odbc-stage /usr/lib/x86_64-linux-gnu/libmsodbcsql-18.* /usr/lib/x86_64-linux-gnu/

# Kerberos / GSSAPI dependencies
COPY --from=odbc-stage /usr/lib/x86_64-linux-gnu/libgssapi_krb5.so.* /usr/lib/x86_64-linux-gnu/
COPY --from=odbc-stage /usr/lib/x86_64-linux-gnu/libkrb5.so.* /usr/lib/x86_64-linux-gnu/
COPY --from=odbc-stage /usr/lib/x86_64-linux-gnu/libk5crypto.so.* /usr/lib/x86_64-linux-gnu/
COPY --from=odbc-stage /usr/lib/x86_64-linux-gnu/libcom_err.so.* /usr/lib/x86_64-linux-gnu/

# ODBC config
COPY --from=odbc-stage /etc/odbcinst.ini /etc/odbcinst.ini
COPY --from=odbc-stage /etc/odbc.ini /etc/odbc.ini

# App files
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
COPY package.json ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["sh", "-c", "bunx prisma generate && bun dist/index.js"]
