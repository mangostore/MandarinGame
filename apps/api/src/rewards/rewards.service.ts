import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'

@Injectable()
export class RewardsService {
  constructor(private prisma: PrismaService) {}

  async getAllAchievements() {
    return this.prisma.achievement.findMany({ orderBy: { conditionValue: 'asc' } })
  }

  async getMyAchievements(userId: number) {
    return this.prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
    })
  }

  async getStreakInfo(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    const milestones = [3, 7, 14, 30, 60, 100]
    const nextMilestone = milestones.find((m) => m > user.streakDays) || milestones[milestones.length - 1]
    const rewardMap: Record<number, string> = {
      3: '解锁"三日连击"成就',
      7: '解锁"连击达人"成就 + 50积分',
      14: '解锁特别称号',
      30: '解锁"月度坚持"成就 + 200积分',
      60: '解锁稀有称号',
      100: '解锁传奇称号',
    }
    return {
      streakDays: user.streakDays,
      lastLoginDate: user.lastLoginDate,
      nextMilestone,
      rewardForNextMilestone: rewardMap[nextMilestone] || '继续保持！',
    }
  }
}
