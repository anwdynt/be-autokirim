# Use the official Bun image as the base for installation
FROM oven/bun:1-alpine AS install
WORKDIR /usr/src/app

# Install Node.js and npm (required for Prisma generate command workaround)
# Alpine images require specific package management
RUN apk add --no-cache nodejs npm openssl

COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source code to the install stage
COPY . .

# Generate Prisma client
# This step works because Node.js is installed in this stage
RUN bunx prisma generate

# Final production stage
FROM oven/bun:1-alpine AS release
WORKDIR /usr/src/app

# Install Node.js and npm in the final stage too
RUN apk add --no-cache nodejs npm openssl

# Copy production dependencies and generated Prisma client from the install stage
COPY --from=install /usr/src/app/node_modules node_modules
COPY --from=install /usr/src/app/. .

# Expose the port your Hono app runs on (default is 3000)
EXPOSE 3000

# Command to run the application
CMD [ "bun", "run", "index.ts" ]
