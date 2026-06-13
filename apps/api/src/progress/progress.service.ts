import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async getMyProgress(userId: number) {
    let progress = await this.prisma.progress.findUnique({ where: { userId } })
    if (!progress) {
      progress = await this.prisma.progress.create({ data: { userId } })
    }
    return progress
  }

  async getStats(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    const progress = await this.getMyProgress(userId)

    // 今日答题数
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todaySessions = await this.prisma.gameSession.findMany({
      where: { userId, createdAt: { gte: todayStart } },
    })
    const todayCorrect = todaySessions.filter((s) => s.isCorrect).length

    // 本周答题数
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - 7)
    const weekSessions = await this.prisma.gameSession.findMany({
      where: { userId, createdAt: { gte: weekStart } },
    })
    const weeklyCorrect = weekSessions.filter((s) => s.isCorrect).length

    // 近10题正确率
    const recentSessions = await this.prisma.gameSession.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })
    const recentCorrect = recentSessions.filter((s) => s.isCorrect).length
    const recentAccuracy = recentSessions.length > 0 ? (recentCorrect / recentSessions.length) * 100 : 0

    return {
      progress,
      recentAccuracy,
      todayCorrect,
      weeklyCorrect,
      streakDays: user.streakDays,
      totalScore: user.totalScore,
      level: user.level,
    }
  }

  async completeLevel(userId: number, levelId: number, score: number, isPerfect: boolean) {
    const progress = await this.getMyProgress(userId)

    // 更新关卡进度
    if (levelId >= progress.currentLevel) {
      await this.prisma.progress.update({
        where: { userId },
        data: { currentLevel: Math.min(levelId + 1, 6) },
      })
    }

    // 如果满分，检查满分成就
    if (isPerfect) {
      const achievement = await this.prisma.achievement.findFirst({
        where: { conditionType: 'PERFECT' },
      })
      if (achievement) {
        const existing = await this.prisma.userAchievement.findUnique({
          where: { userId_achievementId: { userId, achievementId: achievement.id } },
        })
        if (!existing) {
          await this.prisma.userAchievement.create({
            data: { userId, achievementId: achievement.id },
          })
          return { levelCompleted: true, newAchievement: achievement }
        }
      }
    }

    return { levelCompleted: true, newAchievement: null }
  }
}
