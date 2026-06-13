import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../common/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService
  ) {}

  async register(username: string, email: string, password: string) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    })
    if (existing) throw new ConflictException('用户名或邮箱已被注册')

    const hashed = await bcrypt.hash(password, 10)
    const user = await this.prisma.user.create({
      data: { username, email, password: hashed },
    })

    await this.prisma.progress.create({
      data: { userId: user.id },
    })

    const token = this.jwt.sign({ sub: user.id, email: user.email })
    return {
      access_token: token,
      user: this.sanitizeUser(user),
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new UnauthorizedException('邮箱或密码错误')

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) throw new UnauthorizedException('邮箱或密码错误')

    await this.updateStreak(user.id)

    const updated = await this.prisma.user.findUnique({ where: { id: user.id } })
    const token = this.jwt.sign({ sub: user.id, email: user.email })
    return {
      access_token: token,
      user: this.sanitizeUser(updated),
    }
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new UnauthorizedException('用户不存在')
    return this.sanitizeUser(user)
  }

  private async updateStreak(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (!user.lastLoginDate) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { streakDays: 1, lastLoginDate: today },
      })
      return
    }

    const lastLogin = new Date(user.lastLoginDate)
    lastLogin.setHours(0, 0, 0, 0)
    const diffDays = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return // 今天已登录
    if (diffDays === 1) {
      // 连续
      await this.prisma.user.update({
        where: { id: userId },
        data: { streakDays: { increment: 1 }, lastLoginDate: today },
      })
    } else {
      // 中断
      await this.prisma.user.update({
        where: { id: userId },
        data: { streakDays: 1, lastLoginDate: today },
      })
    }
  }

  private sanitizeUser(user: any) {
    const { password, ...rest } = user
    return rest
  }
}
