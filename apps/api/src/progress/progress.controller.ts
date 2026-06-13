import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ProgressService } from './progress.service'
import { JwtAuthGuard } from '../common/jwt-auth.guard'

@ApiTags('progress')
@Controller('progress')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get('me')
  getMyProgress(@Request() req) {
    return this.progressService.getMyProgress(req.user.userId)
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.progressService.getStats(req.user.userId)
  }

  @Post('complete-level')
  completeLevel(
    @Request() req,
    @Body() body: { levelId: number; score: number; isPerfect: boolean }
  ) {
    return this.progressService.completeLevel(req.user.userId, body.levelId, body.score, body.isPerfect)
  }
}
