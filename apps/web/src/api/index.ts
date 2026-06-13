import client from './client'

// ===== Auth =====
export const authApi = {
  register: (data: { username: string; email: string; password: string }) =>
    client.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    client.post('/auth/login', data),
  getProfile: () => client.get('/auth/profile'),
}

// ===== Questions =====
export const questionsApi = {
  getAll: (params?: any) => client.get('/questions', { params }),
  getOne: (id: number) => client.get(`/questions/${id}`),
  getRandom: (params?: any) => client.get('/questions/random', { params }),
  getLevel: (levelId: number) => client.get(`/questions/level/${levelId}`),
}

// ===== Evaluation =====
export const evaluationApi = {
  submit: (data: { questionId: number; userAnswer: string; responseTime: number }) =>
    client.post('/evaluation/submit', data),
  getStats: () => client.get('/evaluation/stats'),
}

// ===== Progress =====
export const progressApi = {
  getMyProgress: () => client.get('/progress/me'),
  getStats: () => client.get('/progress/stats'),
  completeLevel: (data: { levelId: number; score: number; isPerfect: boolean }) =>
    client.post('/progress/complete-level', data),
}

// ===== Error Book =====
export const errorBookApi = {
  getAll: () => client.get('/error-book'),
  getReview: () => client.get('/error-book/review'),
  remove: (id: number) => client.delete(`/error-book/${id}`),
}

// ===== Rewards =====
export const rewardsApi = {
  getAchievements: () => client.get('/rewards/achievements'),
  getMyAchievements: () => client.get('/rewards/my-achievements'),
  getStreak: () => client.get('/rewards/streak'),
}
