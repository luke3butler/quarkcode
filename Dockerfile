FROM oven/bun:1

# Install bash and common tools for safe command execution
RUN apt-get update && apt-get install -y \
    bash \
    git \
    curl \
    ripgrep \
    jq \
    tree \
    fd-find \
    patch \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source code and config  
COPY src/ ./
COPY tsconfig.json ./

# Run TypeScript source directly with Bun (no bundling needed)
ENTRYPOINT ["bun", "/app/index.ts"]