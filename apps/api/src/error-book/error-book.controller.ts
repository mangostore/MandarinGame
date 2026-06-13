import { Controller, Get, Delete, Param, UseGuards, Request } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { ErrorBookService } from './error-book.service'
import { JwtAuthGuard } from '../common/jwt-auth.guard'

@ApiTags('error-book')
@Controller('error-book')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ErrorBookController {
  constructor(private errorBookService: ErrorBookService) {}

  @Get()
  getErrorBook(@Request() req) {
    return this.errorBookService.getErrorBook(req.user.userId)
  }

  @Get('review')
  getReviewList(@Request() req) {
    return this.errorBookService.getReviewList(req.user.userId)
  }

  @Delete(':id')
  removeFromErrorBook(@Request() req, @Param('id') id: string) {
    return this.errorBookService.removeFromErrorBook(req.user.userId, parseInt(id))
  }
}
