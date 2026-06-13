import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './common/prisma.module'
import { AuthModule } from './auth/auth.module'
import { QuestionsModule } from './questions/questions.module'
import { EvaluationModule } from './evaluation/evaluation.module'
import { ProgressModule } from './progress/progress.module'
import { ErrorBookModule } from './error-book/error-book.module'
import { RewardsModule } from './rewards/rewards.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    QuestionsModule,
    EvaluationModule,
    ProgressModule,
    ErrorBookModule,
    RewardsModule,
  ],
})
export class AppModule {}
