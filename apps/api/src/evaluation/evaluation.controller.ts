import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { EvaluationService } from './evaluation.service'
import { JwtAuthGuard } from '../common/jwt-auth.guard'

@ApiTags('evaluation')
@Controller('evaluation')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EvaluationController {
  constructor(private evaluationService: EvaluationService) {}

  @Post('submit')
  submit(
    @Request() req,
    @Body() body: { questionId: number; userAnswer: string; responseTime: number }
  ) {
    return this.evaluationService.submit(
      req.user.userId,
      body.questionId,
      body.userAnswer,
      body.responseTime
    )
  }

  @Get('stats')
  getStats(@Request() req) {
    return this.evaluationService.getSessionStats(req.user.userId)
  }
}
