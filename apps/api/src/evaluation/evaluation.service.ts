import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'
import { QuestionsService } from '../questions/questions.service'

const SCORE_BASE = 10
const SCORE_FAST_BONUS = 5
const SCORE_MEDIUM_BONUS = 2
const STREAK_MULTIPLIER = 0.1
const MAX_STREAK_MULTIPLIER = 2.0
const ADAPTIVE_WINDOW = 10
const DIFFICULTY_UP = 0.8
const DIFFICULTY_DOWN = 0.5
const SRS_INTERVALS = [1, 3, 7, 14, 30]

@Injectable()
export class EvaluationService {
  constructor(
    private prisma: PrismaService,
    private questionsService: QuestionsService
  ) {}

  async submit(userId: number, questionId: number, userAnswer: string, responseTime: number) {
    const question = await this.prisma.question.findUnique({ where: { id: questionId } })
    if (!question) throw new Error('题目不存在')

    const isCorrect = this.checkAnswer(userAnswer, question.text, question.pinyin)

    // 计算分数
    const progress = await this.prisma.progress.findUnique({ where: { userId } })
    const recentSessions = await this.prisma.gameSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    const currentStreak = this.getCurrentStreak(recentSessions)
    const score = this.calculateScore(isCorrect, responseTime, currentStreak)

    // 保存会话
    await this.prisma.gameSession.create({
      data: { userId, questionId, userAnswer, isCorrect, score, responseTime },
    })

    // 更新进度
    await this.updateProgress(userId, isCorrect)

    // 更新错题本
    if (!isCorrect) {
      await this.updateErrorBook(userId, questionId)
    } else {
      await this.markCorrectInErrorBook(userId, questionId)
    }

    // 更新总分
    await this.prisma.user.update({
      where: { id: userId },
      data: { totalScore: { increment: score } },
    })

    // 检查并解锁成就
    const newAchievements = await this.checkAchievements(userId)

    // 获取自适应下一题
    const updatedProgress = await this.prisma.progress.findUnique({ where: { userId } })
    const nextQuestion = await this.questionsService.getRandom({
      difficulty: updatedProgress?.currentDifficulty || 1,
      userId,
      count: 1,
    })

    const feedback = this.generateFeedback(isCorrect, userAnswer, question)

    return {
      isCorrect,
      score,
      feedback,
      userAnswer,
      correctAnswer: question.text,
      correctPinyin: question.pinyin,
      streakBonus: currentStreak,
      newAchievements,
      nextQuestion: nextQuestion[0] || null,
    }
  }

  private checkAnswer(userAnswer: string, correctText: string, correctPinyin: string): boolean {
    const normalized = userAnswer.trim().toLowerCase()
    const textMatch = normalized.includes(correctText.toLowerCase())
    // 提取拼音基础（去调号）
    const basePinyin = correctPinyin.split(' ')[0].replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, (m) => {
      const map: Record<string, string> = {
        ā: 'a', á: 'a', ǎ: 'a', à: 'a',
        ē: 'e', é: 'e', ě: 'e', è: 'e',
        ī: 'i', í: 'i', ǐ: 'i', ì: 'i',
        ō: 'o', ó: 'o', ǒ: 'o', ò: 'o',
        ū: 'u', ú: 'u', ǔ: 'u', ù: 'u',
        ǖ: 'v', ǘ: 'v', ǚ: 'v', ǜ: 'v',
      }
      return map[m] || m
    })
    const pinyinMatch = normalized.includes(basePinyin)
    return textMatch || pinyinMatch
  }

  private calculateScore(isCorrect: boolean, responseTime: number, streak: number): number {
    if (!isCorrect) return 0
    let score = SCORE_BASE
    if (responseTime < 3000) score += SCORE_FAST_BONUS
    else if (responseTime < 5000) score += SCORE_MEDIUM_BONUS

    const multiplier = Math.min(MAX_STREAK_MULTIPLIER, 1 + streak * STREAK_MULTIPLIER)
    return Math.round(score * multiplier)
  }

  private getCurrentStreak(sessions: any[]): number {
    let streak = 0
    for (const s of sessions) {
      if (s.isCorrect) streak++
      else break
    }
    return streak
  }

  private async updateProgress(userId: number, isCorrect: boolean) {
    let progress = await this.prisma.progress.findUnique({ where: { userId } })
    if (!progress) {
      progress = await this.prisma.progress.create({ data: { userId } })
    }

    const newTotal = progress.totalAttempts + 1
    const newCorrect = progress.totalCorrect + (isCorrect ? 1 : 0)
    const accuracy = (newCorrect / newTotal) * 100

    // 自适应难度（基于近10题）
    const recentSessions = await this.prisma.gameSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: ADAPTIVE_WINDOW,
    })
    let newDifficulty = progress.currentDifficulty
    if (recentSessions.length >= ADAPTIVE_WINDOW) {
      const recentCorrect = recentSessions.filter((s) => s.isCorrect).length
      const recentAccuracy = recentCorrect / recentSessions.length
      if (recentAccuracy > DIFFICULTY_UP && newDifficulty < 5) {
        newDifficulty = Math.min(5, newDifficulty + 1)
      } else if (recentAccuracy < DIFFICULTY_DOWN && newDifficulty > 1) {
        newDifficulty = Math.max(1, newDifficulty - 1)
      }
    }

    await this.prisma.progress.update({
      where: { userId },
      data: {
        totalAttempts: newTotal,
        totalCorrect: newCorrect,
        accuracy,
        currentDifficulty: newDifficulty,
      },
    })
  }

  private async updateErrorBook(userId: number, questionId: number) {
    const existing = await this.prisma.errorBook.findUnique({
      where: { userId_questionId: { userId, questionId } },
    })

    if (existing) {
      const errorCount = existing.errorCount + 1
      const intervalIdx = Math.min(errorCount - 1, SRS_INTERVALS.length - 1)
      const nextReviewAt = new Date()
      nextReviewAt.setDate(nextReviewAt.getDate() + SRS_INTERVALS[intervalIdx])

      await this.prisma.errorBook.update({
        where: { id: existing.id },
        data: { errorCount, lastErrorAt: new Date(), nextReviewAt },
      })
    } else {
      const nextReviewAt = new Date()
      nextReviewAt.setDate(nextReviewAt.getDate() + SRS_INTERVALS[0])
      await this.prisma.errorBook.create({
        data: { userId, questionId, nextReviewAt },
      })
    }
  }

  private async markCorrectInErrorBook(userId: number, questionId: number) {
    const existing = await this.prisma.errorBook.findUnique({
      where: { userId_questionId: { userId, questionId } },
    })
    if (!existing) return

    // SRS：答对则延长复习间隔
    const intervalIdx = Math.min(existing.errorCount, SRS_INTERVALS.length - 1)
    const nextReviewAt = new Date()
    nextReviewAt.setDate(nextReviewAt.getDate() + SRS_INTERVALS[intervalIdx])

    await this.prisma.errorBook.update({
      where: { id: existing.id },
      data: { nextReviewAt },
    })
  }

  private async checkAchievements(userId: number): Promise<any[]> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    const progress = await this.prisma.progress.findUnique({ where: { userId } })
    const achievements = await this.prisma.achievement.findMany()
    const userAchievements = await this.prisma.userAchievement.findMany({ where: { userId } })
    const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId))

    const newlyUnlocked = []

    for (const achievement of achievements) {
      if (unlockedIds.has(achievement.id)) continue

      let unlocked = false
      switch (achievement.conditionType) {
        case 'STREAK':
          unlocked = user.streakDays >= achievement.conditionValue
          break
        case 'COUNT':
          unlocked = progress.totalCorrect >= achievement.conditionValue
          break
        case 'LEVEL':
          unlocked = progress.currentLevel >= achievement.conditionValue
          break
        case 'PERFECT':
          // 单关满分由前端上报
          break
      }

      if (unlocked) {
        await this.prisma.userAchievement.create({
          data: { userId, achievementId: achievement.id },
        })
        newlyUnlocked.push(achievement)
      }
    }

    return newlyUnlocked
  }

  private generateFeedback(isCorrect: boolean, userAnswer: string, question: any): string {
    if (isCorrect) {
      const messages = ['发音正确！👏', '太棒了！继续加油！🎉', '完美！🌟', '正确！你真棒！✨']
      return messages[Math.floor(Math.random() * messages.length)]
    }
    const confusable = (question.confusableWith as string[]) || []
    if (confusable.length > 0) {
      return `发音有误。正确发音是 ${question.pinyin}，注意不要与 ${confusable[0]} 混淆。`
    }
    return `发音有误。正确发音是 ${question.text}（${question.pinyin}），请再练习一下。`
  }

  async getSessionStats(userId: number) {
    const sessions = await this.prisma.gameSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: ADAPTIVE_WINDOW,
    })
    const correct = sessions.filter((s) => s.isCorrect).length
    const accuracy = sessions.length > 0 ? (correct / sessions.length) * 100 : 0
    const streak = this.getCurrentStreak(sessions)
    return { recentAccuracy: accuracy, currentStreak: streak, sessionCount: sessions.length }
  }
}
