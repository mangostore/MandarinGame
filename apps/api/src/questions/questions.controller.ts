import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { QuestionsService } from './questions.service'
import { JwtAuthGuard } from '../common/jwt-auth.guard'

@ApiTags('questions')
@Controller('questions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Get()
  findAll(
    @Query('difficulty') difficulty?: string,
    @Query('type') type?: string,
    @Query('category') category?: string,
    @Query('limit') limit?: string
  ) {
    return this.questionsService.findAll({
      difficulty: difficulty ? parseInt(difficulty) : undefined,
      type,
      category,
      limit: limit ? parseInt(limit) : undefined,
    })
  }

  @Get('random')
  getRandom(@Query('difficulty') difficulty?: string, @Query('count') count?: string, @Request() req?) {
    return this.questionsService.getRandom({
      difficulty: difficulty ? parseInt(difficulty) : 1,
      userId: req.user?.userId,
      count: count ? parseInt(count) : 5,
    })
  }

  @Get('level/:levelId')
  getLevel(@Param('levelId') levelId: string, @Request() req) {
    return this.questionsService.getQuestionsForLevel(parseInt(levelId))
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionsService.findOne(parseInt(id))
  }
}
