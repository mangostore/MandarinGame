import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common/prisma.service'

@Injectable()
export class ErrorBookService {
  constructor(private prisma: PrismaService) {}

  async getErrorBook(userId: number) {
    return this.prisma.errorBook.findMany({
      where: { userId },
      include: { question: true },
      orderBy: { errorCount: 'desc' },
    })
  }

  async getReviewList(userId: number) {
    const now = new Date()
    return this.prisma.errorBook.findMany({
      where: { userId, nextReviewAt: { lte: now } },
      include: { question: true },
      orderBy: { nextReviewAt: 'asc' },
    })
  }

  async removeFromErrorBook(userId: number, id: number) {
    const item = await this.prisma.errorBook.findUnique({ where: { id } })
    if (!item || item.userId !== userId) throw new Error('记录不存在')
    return this.prisma.errorBook.delete({ where: { id } })
  }
}
