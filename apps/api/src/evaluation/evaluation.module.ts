import { Module } from '@nestjs/common'
import { EvaluationController } from './evaluation.controller'
import { EvaluationService } from './evaluation.service'
import { QuestionsModule } from '../questions/questions.module'

@Module({
  imports: [QuestionsModule],
  controllers: [EvaluationController],
  providers: [EvaluationService],
})
export class EvaluationModule {}
