import { Controller, Get, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { RewardsService } from './rewards.service'
import { JwtAuthGuard } from '../common/jwt-auth.guard'

@ApiTags('rewards')
@Controller('rewards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RewardsController {
  constructor(private rewardsService: RewardsService) {}

  @Get('achievements')
  getAllAchievements() {
    return this.rewardsService.getAllAchievements()
  }

  @Get('my-achievements')
  getMyAchievements(@Request() req) {
    return this.rewardsService.getMyAchievements(req.user.userId)
  }

  @Get('streak')
  getStreak(@Request() req) {
    return this.rewardsService.getStreakInfo(req.user.userId)
  }
}
