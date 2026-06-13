# AGENTS.md

普通话发音学习游戏（MandarinGame）。事实来源见 [`docs/SPEC.md`](docs/SPEC.md)，启动步骤见 [`README.md`](README.md)。
技术栈：Vue3 + NestJS + Prisma + PostgreSQL，pnpm Monorepo（`apps/*` + `packages/*`）。

## Cursor Cloud specific instructions

适用于已运行过更新脚本的云端环境。常规命令以 `package.json` scripts / `README.md` / `docs/SPEC.md` 为准，这里只记录非显而易见的注意事项。

- **当前是脚手架阶段**：`apps/web`、`apps/api`、`packages/shared` 尚未实现（按 `docs/SPEC.md` 待开发）。在它们存在之前，`pnpm dev` / `pnpm build` / `pnpm lint` 会输出 `No projects matched the filters` 而非真正运行——这是正常的，不是环境错误。实现对应 package 后这些命令才会生效。
- **PostgreSQL 必须先启动**：运行 `bash .cursor/start.sh` 会启动服务并幂等创建 `mandarin` 角色与 `mandarin` 数据库。默认连接串见 `.env.example`，后端使用时需 `cp .env.example apps/api/.env`。
- **psql 不在默认 PATH**：客户端位于 `/usr/lib/postgresql/16/bin`。`.env.example` 中连接串结尾的 `?schema=public` 是 Prisma 专用参数，直接喂给 `psql` 会报 `invalid URI query parameter: "schema"`（Prisma 自身可正确处理）。
- **pnpm 版本由 corepack 锁定**：仓库 `package.json` 的 `packageManager` 指定 `pnpm@9.15.0`；在仓库内执行 `pnpm` 时 corepack 会自动切到该版本（Node 20+ 即可，VM 上 Node 22 满足要求）。
- **权威环境配置**：`.cursor/Dockerfile`（Node 20 + pnpm@9.15.0 + PostgreSQL）+ `.cursor/environment.json`（install / start / 并行起 web+api 终端）。修改云环境工具链应改 Dockerfile，而非依赖快照。
- **实现 apps 后的首次启动顺序**：`pnpm install` → `bash .cursor/start.sh` → `pnpm prisma:migrate` → `pnpm db:seed` → `pnpm dev`。
