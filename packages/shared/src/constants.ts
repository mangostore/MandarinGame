export const SCORE_BASE = 10
export const SCORE_FAST_BONUS = 5   // < 3s
export const SCORE_MEDIUM_BONUS = 2 // < 5s

export const STREAK_MULTIPLIER = 0.1
export const MAX_STREAK_MULTIPLIER = 2.0

export const DIFFICULTY_UP_THRESHOLD = 0.8    // 正确率 > 80% 提难度
export const DIFFICULTY_DOWN_THRESHOLD = 0.5  // 正确率 < 50% 降难度
export const ADAPTIVE_WINDOW = 10             // 近N题

export const SRS_INTERVALS = [1, 3, 7, 14, 30] // 间隔复习天数

export const LEVELS = [
  { id: 1, name: '声调入门', description: '学习四个基础声调', difficulty: 1, questionCount: 5, minScore: 30, category: 'TONE' },
  { id: 2, name: '平翘舌', description: 'z/zh, s/sh, c/ch 的区分', difficulty: 2, questionCount: 5, minScore: 35, category: 'INITIAL' },
  { id: 3, name: '前后鼻音', description: 'n/ng 韵母区分', difficulty: 2, questionCount: 5, minScore: 35, category: 'FINAL' },
  { id: 4, name: 'l/n 混淆', description: 'l 与 n 声母的区分', difficulty: 3, questionCount: 5, minScore: 40, category: 'INITIAL' },
  { id: 5, name: '综合挑战', description: '综合各类易混淆音', difficulty: 4, questionCount: 5, minScore: 45, category: 'MIXED' },
  { id: 6, name: '大师关卡', description: '最高难度综合测试', difficulty: 5, questionCount: 5, minScore: 50, category: 'MIXED' },
]

export const ACHIEVEMENTS = [
  { name: '初学者', description: '完成第一关', icon: '🎯', type: 'LEVEL', value: 1 },
  { name: '连击达人', description: '连续7天登录', icon: '🔥', type: 'STREAK', value: 7 },
  { name: '满分选手', description: '单关获得满分', icon: '⭐', type: 'PERFECT', value: 1 },
  { name: '纠音大师', description: '累计正确1000题', icon: '🏆', type: 'COUNT', value: 1000 },
  { name: '挑战者', description: '完成最高难度关卡', icon: '💎', type: 'LEVEL', value: 6 },
  { name: '三日连击', description: '连续3天登录', icon: '✨', type: 'STREAK', value: 3 },
  { name: '月度坚持', description: '连续30天登录', icon: '🌙', type: 'STREAK', value: 30 },
  { name: '百题达人', description: '累计正确100题', icon: '💯', type: 'COUNT', value: 100 },
]
