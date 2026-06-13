import { Module } from '@nestjs/common'
import { ErrorBookController } from './error-book.controller'
import { ErrorBookService } from './error-book.service'

@Module({
  controllers: [ErrorBookController],
  providers: [ErrorBookService],
})
export class ErrorBookModule {}
