# MandarinGame · 普通话发音学习游戏

以语音识别 / 发音评测为核心、游戏化驱动的普通话发音训练 Web 应用。当前阶段：**MVP（赛道 A 母语纠音 + Web Speech 评测）**。

- 需求规格说明书（事实来源）：见 [`docs/SPEC.md`](docs/SPEC.md)
- 技术栈：Vue3 + NestJS + Prisma + PostgreSQL（pnpm Monorepo）

## 开发环境

需要 **Node 20+**。本地若 Node 过旧，推荐使用 **Cursor 云环境**开发（见 `.cursor/`）。

### 云环境（推荐）

1. 提交并推送 `.cursor/` 配置到远程分支。
2. 在 Cursor 桌面端 Agent 输入框下拉选择 **Cloud**（或访问 cursor.com/agents）发起云端 Agent。
3. 云端会自动构建环境（Node 20 + pnpm + PostgreSQL）、`pnpm install` 并启动服务。

### 本地（需 Node 20+ / pnpm / PostgreSQL）

```bash
pnpm install
cp .env.example apps/api/.env   # 按需调整 DATABASE_URL
pnpm prisma:migrate && pnpm db:seed
pnpm dev                        # 并行启动 web 与 api
```

> 注：`apps/`、`packages/` 等业务代码将在云端环境中按 `docs/SPEC.md` 实现。
