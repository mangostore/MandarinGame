# Cursor Cloud Agent 基础镜像
# 仅安装工具链与服务（Node 20 / pnpm / PostgreSQL），不要 COPY 仓库代码，
# 仓库会在云端运行时自动 clone 进来。
FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl ca-certificates gnupg git build-essential sudo \
    postgresql postgresql-contrib \
    && rm -rf /var/lib/apt/lists/*

# Node.js 20 (NodeSource)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# 启用 corepack 并激活 pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Cursor 云端代理以 `ubuntu` 用户运行，给予免密 sudo（用于启动 postgres 服务）
RUN (usermod -aG sudo ubuntu 2>/dev/null || true) \
    && echo "ubuntu ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/ubuntu \
    && chmod 0440 /etc/sudoers.d/ubuntu

USER ubuntu
WORKDIR /home/ubuntu
