// ===== 枚举 =====

export enum QuestionType {
  TONE = 'TONE',           // 声调
  INITIAL = 'INITIAL',     // 声母
  FINAL = 'FINAL',         // 韵母
  MIXED = 'MIXED',         // 综合
}

export enum AchievementType {
  STREAK = 'STREAK',
  ACCURACY = 'ACCURACY',
  COUNT = 'COUNT',
  PERFECT = 'PERFECT',
  LEVEL = 'LEVEL',
}

// ===== 用户 =====

export interface User {
  id: number
  username: string
  email: string
  streakDays: number
  lastLoginDate: string | null
  totalScore: number
  level: number
  createdAt: string
}

export interface AuthResponse {
  access_token: string
  user: User
}

export interface RegisterDto {
  username: string
  email: string
  password: string
}

export interface LoginDto {
  email: string
  password: string
}

// ===== 题目 =====

export interface Question {
  id: number
  type: QuestionType
  text: string
  pinyin: string
  audio?: string
  difficulty: number
  confusableWith: string[]
  category: string
  hint?: string
}

export interface QuestionListParams {
  difficulty?: number
  type?: QuestionType
  category?: string
  limit?: number
}

// ===== 评测 =====

export interface SubmitEvaluationDto {
  questionId: number
  userAnswer: string
  responseTime: number
}

export interface EvaluationResult {
  isCorrect: boolean
  score: number
  feedback: string
  userAnswer: string
  correctAnswer: string
  streakBonus: number
  totalScore: number
  nextQuestion?: Question
}

// ===== 进度 =====

export interface Progress {
  id: number
  userId: number
  currentLevel: number
  currentDifficulty: number
  totalCorrect: number
  totalAttempts: number
  accuracy: number
}

export interface ProgressStats {
  progress: Progress
  recentAccuracy: number
  todayCorrect: number
  weeklyCorrect: number
  streakDays: number
  totalScore: number
  level: number
}

// ===== 错题本 =====

export interface ErrorBookItem {
  id: number
  userId: number
  questionId: number
  question: Question
  errorCount: number
  lastErrorAt: string
  nextReviewAt: string
}

// ===== 成就 =====

export interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  condition: AchievementCondition
}

export interface AchievementCondition {
  type: AchievementType
  value: number
}

export interface UserAchievement {
  id: number
  userId: number
  achievementId: number
  achievement: Achievement
  unlockedAt: string
}

// ===== 奖励 =====

export interface StreakInfo {
  streakDays: number
  lastLoginDate: string | null
  nextMilestone: number
  rewardForNextMilestone: string
}

// ===== 通用响应 =====

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// ===== 关卡 =====

export interface Level {
  id: number
  name: string
  description: string
  difficulty: number
  questionCount: number
  minScore: number
  isUnlocked: boolean
  isCompleted: boolean
  bestScore?: number
  category: string
}
