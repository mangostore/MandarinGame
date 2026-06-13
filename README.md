# MandarinGame 🎙️

**母语纠音游戏化学习应用** — 赛道A：利用 Web Speech API 对普通话发音进行实时评测，通过闯关、积分、连击、成就等游戏化机制提升学习动力。

## 技术栈

| 层次 | 技术 |
|------|------|
| 前端 | Vue 3 + Vite + TypeScript + Pinia + NaiveUI + Tailwind CSS |
| 后端 | NestJS + Prisma + PostgreSQL + JWT |
| 语音 | Web Speech API（浏览器原生，无需后端语音服务） |
| 工程 | pnpm Monorepo |

## 项目结构

```
mandarin-game/
├── apps/
│   ├── api/          # NestJS 后端
│   │   ├── src/
│   │   │   ├── auth/        # JWT 认证
│   │   │   ├── questions/   # 题库（含自适应难度）
│   │   │   ├── evaluation/  # 评测 + SRS 错题本
│   │   │   ├── progress/    # 进度管理
│   │   │   ├── error-book/  # 错题本
│   │   │   └── rewards/     # 成就 + Streak
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── seed.ts      # 46道易混淆音种子题库
│   └── web/          # Vue 3 前端
│       └── src/
│           ├── views/       # 页面
│           ├── stores/      # Pinia 状态
│           ├── api/         # API 封装
│           └── components/  # 组件
├── packages/
│   └── shared/       # 共享 TypeScript 类型
└── docs/
    └── SPEC.md       # 需求规格说明书
```

## 环境要求

- Node.js >= 18
- pnpm >= 9
- PostgreSQL >= 14

## 快速启动

### 1. 克隆并安装依赖

```bash
git clone <repo-url>
cd mandarin-game
pnpm install
```

### 2. 配置数据库

默认数据库连接串（可在 `apps/api/.env` 中修改）：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mandarin_game?schema=public"
JWT_SECRET="mandarin-game-super-secret-jwt-key-2024"
JWT_EXPIRES_IN="7d"
PORT=3000
```

确保 PostgreSQL 运行中，并创建数据库：

```bash
# Ubuntu/Debian
sudo service postgresql start
sudo -u postgres psql -c "CREATE DATABASE mandarin_game;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';"
```

### 3. 初始化数据库

```bash
cd apps/api

# 执行迁移
npx prisma migrate dev --name init

# 播种题库数据（46道易混淆音 + 8个成就）
npx ts-node prisma/seed.ts
```

### 4. 启动后端

```bash
# 开发模式（热重载）
cd apps/api
pnpm dev

# 或生产模式
pnpm build && pnpm start
```

后端默认运行在 http://localhost:3000
API 文档：http://localhost:3000/api/docs

### 5. 启动前端

```bash
cd apps/web
pnpm dev
```

前端默认运行在 http://localhost:5173

### 一键启动（并行）

```bash
# 在项目根目录
pnpm dev  # 并行启动前后端
```

## 演示账号

| 字段 | 值 |
|------|-----|
| 邮箱 | demo@mandarin.game |
| 密码 | demo123456 |

## 功能特性

### 🎯 核心功能
- **Web Speech API 实时评测**：浏览器原生语音识别，中文识别（zh-CN）
- **46道易混淆音题库**：覆盖声调、平翘舌、前后鼻音、l/n混淆等场景
- **JWT 账号系统**：注册/登录/个人资料
- **6个关卡**：声调入门→平翘舌→前后鼻音→l/n混淆→综合挑战→大师关卡

### 🧠 自适应难度引擎
- 基于近10题正确率动态调整：
  - 正确率 > 80%：提升难度
  - 正确率 < 50%：降低难度
- SRS间隔复习算法（错题本）：1→3→7→14→30天间隔

### 🎮 游戏化机制
- **积分系统**：基础10分 + 响应时间加成（3秒内+5分）+ 连击倍数加成（最高2倍）
- **Streak（连击天数）**：每日登录累计，成就解锁
- **confetti 通关动画**：canvas-confetti 彩屑特效
- **成就系统**：8个成就，实时检测解锁

### 📖 错题本
- 自动记录错误题目
- SRS间隔复习提醒
- 错误次数统计

## API 接口

| 路由 | 说明 |
|------|------|
| `POST /api/auth/register` | 注册 |
| `POST /api/auth/login` | 登录 |
| `GET /api/auth/profile` | 个人信息 |
| `GET /api/questions/level/:id` | 获取关卡题目 |
| `POST /api/evaluation/submit` | 提交评测 |
| `GET /api/progress/stats` | 进度统计 |
| `GET /api/error-book` | 错题本 |
| `GET /api/rewards/achievements` | 成就列表 |
| `GET /api/rewards/streak` | Streak信息 |

完整文档：http://localhost:3000/api/docs（Swagger UI）

## 开发脚本

```bash
# 后端
cd apps/api
pnpm dev          # 热重载开发
pnpm build        # 构建
pnpm db:migrate   # 执行迁移
pnpm db:seed      # 播种数据
pnpm db:studio    # Prisma Studio GUI

# 前端
cd apps/web
pnpm dev          # 开发服务器
pnpm build        # 生产构建
pnpm preview      # 预览构建
```

## 浏览器兼容性

Web Speech API 需要 Chrome/Edge 等 Chromium 内核浏览器。Firefox 暂不支持，Safari 支持有限。应用内提供手动输入备用方案。

## 许可证

MIT
