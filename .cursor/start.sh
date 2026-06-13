#!/usr/bin/env bash
# 云端环境启动脚本：拉起 PostgreSQL 并确保业务库/角色存在。
set -euo pipefail

DB_USER="${DB_USER:-mandarin}"
DB_PASSWORD="${DB_PASSWORD:-mandarin}"
DB_NAME="${DB_NAME:-mandarin}"

echo "[start] 启动 PostgreSQL ..."
sudo service postgresql start

echo "[start] 确保角色 ${DB_USER} 存在 ..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1 \
  || sudo -u postgres psql -c "CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASSWORD}' SUPERUSER"

echo "[start] 确保数据库 ${DB_NAME} 存在 ..."
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1 \
  || sudo -u postgres createdb -O "${DB_USER}" "${DB_NAME}"

echo "[start] PostgreSQL 就绪：postgresql://${DB_USER}:***@localhost:5432/${DB_NAME}"
