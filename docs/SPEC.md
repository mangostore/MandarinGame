# MandarinGame 需求规格说明书
## 确认稿 v1.0

---

## 1. 产品概述

**MandarinGame** 是一款面向母语人群的普通话纠音游戏化学习应用（赛道 A：母语纠音），利用 Web Speech API 对用户发音进行实时评测，通过闯关、积分、连击、成就等游戏化机制提升学习动力。

---

## 2. 技术栈

### 前端 (apps/web)
- Vue 3 + Vite + TypeScript
- Pinia（状态管理）
- NaiveUI（组件库）
- Tailwind CSS（样式）
- Web Speech API（录音识别评测）
- canvas-confetti（通关庆祝动画）

### 后端 (apps/api)
- NestJS + TypeScript
- Prisma ORM
- PostgreSQL
- JWT（身份认证）
- Passport.js

### 共享包 (packages/shared)
- 共享 TypeScript 类型定义

### 工程化
- pnpm Monorepo（workspace）
- ESLint + Prettier

---

## 3. 数据模型（Prisma Schema）

### User（用户）
- id, username, password（bcrypt）, email
- createdAt, updatedAt
- streakDays（连击天数）, lastLoginDate
- totalScore（总积分）, level（用户等级）

### Question（题目）
- id, type（TONE/INITIAL/FINAL/MIXED）
- text（题目文字）, pinyin（拼音）
- audio（参考音频URL，可选）
- difficulty（1-5）
- confusableWith（易混淆词列表JSON）
- category（分类）

### GameSession（游戏会话）
- id, userId, questionId
- userAnswer（用户答案）, isCorrect
- score（本题得分）, responseTime（毫秒）
- createdAt

### Progress（进度）
- id, userId
- currentLevel（当前关卡）, currentDifficulty
- totalCorrect, totalAttempts
- accuracy（正确率）

### ErrorBook（错题本）
- id, userId, questionId
- errorCount（错误次数）, lastErrorAt
- nextReviewAt（下次复习时间，SRS间隔复习）

### Achievement（成就）
- id, name, description, icon
- condition（解锁条件JSON）

### UserAchievement（用户成就）
- id, userId, achievementId, unlockedAt

---

## 4. API 接口

### 认证模块 /auth
- POST /auth/register（注册）
- POST /auth/login（登录，返回JWT）
- GET /auth/profile（获取个人信息）

### 题库模块 /questions
- GET /questions（获取题目列表，支持难度/分类筛选）
- GET /questions/random（随机获取题目，基于自适应难度）
- GET /questions/:id（获取单题）

### 评测模块 /evaluation
- POST /evaluation/submit（提交评测结果）
  - 输入：questionId, userAnswer, responseTime
  - 输出：isCorrect, score, feedback, nextQuestion

### 进度模块 /progress
- GET /progress/me（获取当前进度）
- GET /progress/stats（获取统计数据）

### 错题本 /error-book
- GET /error-book（获取错题列表）
- GET /error-book/review（获取待复习题目）
- DELETE /error-book/:id（从错题本移除）

### 奖励模块 /rewards
- GET /rewards/achievements（获取所有成就）
- GET /rewards/my-achievements（获取已获成就）
- GET /rewards/streak（获取连击信息）

---

## 5. 前端页面

### 5.1 登录/注册页 /auth
- 邮箱+密码登录、注册表单
- 表单验证
- JWT token 存储

### 5.2 主页/关卡地图 /
- 关卡列表（已解锁/未解锁/已通关）
- 当前连击天数 streak 展示
- 用户等级、总积分
- 进度可视化

### 5.3 闯关页 /game/:level
- 题目展示（文字+拼音提示）
- 录音按钮（Web Speech API）
- 实时识别反馈
- 评分动画（正确/错误）
- 连击计数
- 关卡进度条
- 通关时 confetti 动画

### 5.4 错题本页 /error-book
- 错题列表（按错误次数排序）
- 间隔复习提醒
- 点击进入专项练习

### 5.5 成就页 /achievements
- 成就列表（已获得/未获得）
- 成就解锁动画
- 积分排行（个人统计）

---

## 6. 自适应难度引擎

基于用户近期表现动态调整题目难度：
- 近10题正确率 > 80%：提升难度
- 近10题正确率 < 50%：降低难度
- 否则：保持当前难度
- 结合错题本，优先推送待复习题目（SRS间隔复习算法）

---

## 7. 易混淆音种子题库

初始种子数据涵盖以下易混淆场景：

### 声调混淆
- 妈(mā)/马(mǎ)/骂(mà)
- 知(zhī)/纸(zhǐ)/志(zhì)

### 平翘舌混淆
- z/zh：在(zài)/斋(zhāi)，造(zào)/找(zhǎo)
- s/sh：三(sān)/山(shān)，四(sì)/是(shì)
- c/ch：才(cái)/柴(chái)

### 前后鼻音混淆
- n/ng：音(yīn)/英(yīng)，金(jīn)/京(jīng)
- an/ang：安(ān)/昂(áng)，看(kàn)/康(kāng)

### l/n 混淆
- 牛(niú)/留(liú)，年(nián)/连(lián)

### 韵母混淆
- 恩(ēn)/嗯(ń)，喝(hē)/河(hé)

---

## 8. 游戏化机制

### 积分系统
- 答对基础分：10分
- 响应时间加成：< 3秒 +5分，< 5秒 +2分
- 连击加成：连续答对N题，分数 × (1 + N×0.1)，最高2倍

### Streak（连击天数）
- 每天登录并完成至少1关：streak+1
- 中断则重置为0
- 成就：streak达3/7/30天解锁

### 成就系统
- 初学者：完成第一关
- 连击达人：7天连续登录
- 满分选手：单关100%正确率
- 纠音大师：累计正确1000题
- 挑战者：挑战最高难度

---

## 9. 种子题库（50题示例）

详见 `apps/api/prisma/seed.ts`

---

## 10. 非功能需求

- 响应时间：API < 200ms
- 前端首屏加载 < 3s
- 支持移动端自适应布局
- 录音识别使用浏览器原生 Web Speech API（无需后端语音服务）
