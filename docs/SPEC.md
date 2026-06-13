# 普通话发音学习游戏 · 需求规格说明书（确认稿 v1.0）

> 本文件是项目的"事实来源"。云端 Agent / 新协作者请先阅读本文件，再继续开发。

## 1. 产品定位

以「语音识别 / 发音评测」为核心、游戏化驱动的普通话发音训练 Web 应用。
循环：**练习 → 评测反馈 → 错题强化 → 自适应难度 → 闯关奖励**。

### 两个方向（双赛道）

| 赛道 | 目标人群 | 训练重点 | 评价基准 |
|---|---|---|---|
| **A. 母语纠音**（MVP 先做） | 中文母语、带方言口音/读音错误者 | 平翘舌(z/zh、c/ch、s/sh)、前后鼻音(an/ang、in/ing)、n/l、h/f、声调 | 对标普通话水平测试 PSC |
| B. 非母语入门（V1） | 刚接触中文者 | 拼音/声母韵母/声调基础、常用词句 | 能被听懂、对标 HSK |

## 2. 已确认的关键决策

| 决策项 | 结论 |
|---|---|
| 发音评测 | **混合方案**：MVP 用浏览器 Web Speech API 跑通，后端抽象 `IPronunciationAssessor` 适配器，后续接入**科大讯飞 ISE** |
| MVP 赛道 | **赛道 A（母语纠音）** |
| 声调评测 | **MVP 暂不评声调**（Web Speech 无法评调），接入讯飞 ISE 后开启；前端预留声调展示位 |
| 数据库 | **PostgreSQL** + Prisma |
| 礼物奖励 | **纯虚拟**：通关动画 + 徽章/成就 + 经验/积分（不涉及支付） |
| 非母语界面多语言 | 中英双语，赛道 B 用，**留待 V1**（MVP 先中文） |
| 前端 UI | **Naive UI + Tailwind CSS** |
| 仓库结构 | **pnpm Monorepo** |
| 运行环境 | Node 20+；本地 Node 14 过旧，故在 **Cursor 云环境**开发（见 §8） |

## 3. MVP 范围（赛道 A + Web Speech）

> ⚠️ MVP 取舍：Web Speech API 是「语音转文字」。
> - ✅ 能判断声母/韵母混淆（如"是 shì"读成"四 sì"会被识别成错字 → 判错并入错题本，覆盖平翘舌/n-l/h-f 等核心痛点）。
> - ❌ 暂不能判断声调（读成"时 shí"对 ASR 仍算对）。声调评测等接入讯飞 ISE 后开启。

1. **账号**：邮箱/密码注册登录（JWT），保存进度与错题本。
2. **关卡**：单字 → 词语 → 短句 三级闯关，内置围绕易混淆音组织的种子题库。
3. **录音评测**：MediaRecorder 录音 → Web Speech 识别 → 与目标拼音/文本比对 → 拼音着色反馈（绿=准 / 红=错）。
4. **自适应**：错误项加权重复出现；正确率达标解锁下一关。
5. **错题本**：自动归集易错音并标注错误类型（如 "zh→z 平翘舌混淆"），支持专项复习。
6. **奖励**：通关 confetti 动画 + 徽章/成就 + 经验值；连续打卡 streak。

## 4. 技术架构

```
[ apps/web ]  Vue3 + Vite + TS + Pinia + Vue Router + Naive UI + Tailwind
   │             录音(MediaRecorder) / Web Speech 识别 / 拼音可视化 / 动画(canvas-confetti)
   │ REST (JSON, JWT)
[ apps/api ]  NestJS + TS
   │             Auth(JWT) · 题库 · 评测校验 · 自适应引擎 · 进度&错题本 · 奖励规则
   │ Prisma
[ PostgreSQL ]
[ packages/shared ]  前后端共享类型（评测结果/题库结构/拼音工具/错误类型枚举）
```

评测核心抽象为 `IPronunciationAssessor`：MVP 提供前端 `WebSpeechAssessor` + 后端文本/拼音比对校验；未来加 `IflytekAssessor`（声韵调）。

## 5. 工程结构

```
MandarinGame/
├─ apps/
│  ├─ web/        # Vue3 前端
│  └─ api/        # NestJS 后端
│     └─ prisma/  # schema + seed(种子题库)
├─ packages/
│  └─ shared/     # 共享类型与拼音/评测工具
├─ .cursor/       # 云环境配置(Dockerfile / environment.json / start.sh)
├─ docs/SPEC.md   # 本文件
├─ pnpm-workspace.yaml
└─ package.json
```

## 6. 初步数据模型（Prisma 草案）

- `User` / `Profile`（赛道、等级、XP、streak）
- `ContentItem`（字/词/句；字段：text、pinyin、tones、audioUrl、difficulty、type、phonemeTags、confusionPairs）
- `Level` / `Stage`（闯关结构、解锁条件、通关目标）
- `Attempt`（评测记录：recognizedText、overallScore、initialScore、finalScore、toneScore(预留)、audioUrl、passed）
- `ErrorWord`（错题本：contentItemId、errorType、count、lastSeenAt、mastered）
- `Achievement` / `Badge` / `UserAchievement`
- `PointLedger`（XP/积分流水）

## 7. 迭代计划

| 阶段 | 范围 |
|---|---|
| **MVP** | 赛道 A + Web Speech 评测 + 三级闯关 + 自适应 + 错题本 + 虚拟奖励 + 账号 |
| **V1** | 接入讯飞 ISE（声韵调）+ 赛道 B + 中英双语 + 学习报告/雷达图 |
| **V2** | 排行榜/社交、内容扩充、为多端复用沉淀 API |

## 8. 在 Cursor 云环境开发

本地 Node 为 v14（过旧），现代 Vite/NestJS/Prisma 需 Node 20+，故在 Cursor 云端 Ubuntu 环境开发。

- `.cursor/Dockerfile`：安装 Node 20 + pnpm + PostgreSQL。
- `.cursor/environment.json`：`install`(`pnpm install`)、`start`(启动 PG)、`terminals`(并行起 web/api dev)。
- `.cursor/start.sh`：启动 PostgreSQL 并创建 `mandarin` 角色与数据库。
- 默认连接串：`postgresql://mandarin:mandarin@localhost:5432/mandarin?schema=public`。

### 云端 Agent 接力 Prompt（可直接粘贴）

> 阅读 `docs/SPEC.md`，这是已确认的需求规格说明书。请按"确认稿 v1.0"实现 **MVP（赛道 A 母语纠音 + Web Speech 评测）**：搭建 pnpm Monorepo（apps/web=Vue3+Vite+TS+Pinia+NaiveUI+Tailwind，apps/api=NestJS+Prisma+PostgreSQL，packages/shared=共享类型），实现 Prisma schema + 易混淆音种子题库、JWT 账号、题库/评测/进度&错题本/奖励 API、前端登录/闯关/录音识别反馈/错题本/成就页、自适应难度引擎、confetti 通关动画与 streak。数据库连接串用 `.cursor` 环境默认值。完成后跑通本地联调并在 README 写启动步骤。
