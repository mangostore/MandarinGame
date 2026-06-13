import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: { difficulty?: number; type?: string; category?: string; limit?: number }) {
    const where: any = {}
    if (params.difficulty) where.difficulty = params.difficulty
    if (params.type) where.type = params.type
    if (params.category) where.category = params.category

    return this.prisma.question.findMany({
      where,
      take: params.limit || 50,
      orderBy: { difficulty: 'asc' },
    })
  }

  async findOne(id: number) {
    return this.prisma.question.findUnique({ where: { id } })
  }

  async getRandom(params: { difficulty?: number; userId?: number; count?: number }) {
    const count = params.count || 5
    const difficulty = params.difficulty || 1

    // 先检查错题本中待复习的题目
    let reviewQuestions = []
    if (params.userId) {
      const now = new Date()
      reviewQuestions = await this.prisma.errorBook.findMany({
        where: {
          userId: params.userId,
          nextReviewAt: { lte: now },
        },
        include: { question: true },
        take: Math.floor(count / 2),
        orderBy: { nextReviewAt: 'asc' },
      })
    }

    const reviewIds = reviewQuestions.map((r) => r.questionId)
    const reviewCount = reviewQuestions.length

    // 补充正常题目
    const normalQuestions = await this.prisma.question.findMany({
      where: {
        id: { notIn: reviewIds },
        difficulty: { gte: Math.max(1, difficulty - 1), lte: Math.min(5, difficulty + 1) },
      },
      take: count - reviewCount + 20,
    })

    // 随机打乱
    const shuffled = normalQuestions.sort(() => Math.random() - 0.5).slice(0, count - reviewCount)
    const allQuestions = [...reviewQuestions.map((r) => r.question), ...shuffled]

    return allQuestions.sort(() => Math.random() - 0.5).slice(0, count)
  }

  async getQuestionsForLevel(levelId: number): Promise<any[]> {
    const difficultyMap = { 1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 5 }
    const categoryMap = {
      1: 'TONE',
      2: 'INITIAL',
      3: 'FINAL',
      4: 'LN',
      5: 'MIXED',
      6: 'MIXED',
    }
    const difficulty = difficultyMap[levelId] || 1
    const category = categoryMap[levelId]

    const questions = await this.prisma.question.findMany({
      where: { difficulty, category },
      take: 20,
    })

    return questions.sort(() => Math.random() - 0.5).slice(0, 5)
  }
}
