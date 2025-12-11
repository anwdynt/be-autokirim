FROM oven/bun:latest AS base
WORKDIR /app

# Copy package.json & prisma schema
COPY package.json bun.lockb prisma ./ 

# Install dependencies
RUN bun install

# Generate Prisma Client
RUN bunx prisma generate

# Copy source code
COPY . .

# Build (opsional, jika pakai bun build)
# RUN bun build src/index.ts --outdir dist

EXPOSE 3000

CMD ["bun", "run", "src/index.ts"]
