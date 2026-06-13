import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:4173'],
    credentials: true,
  })

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('MandarinGame API')
    .setDescription('母语纠音游戏化学习应用 API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  const port = process.env.PORT || 3000
  await app.listen(port)
  console.log(`🚀 MandarinGame API 运行在 http://localhost:${port}/api`)
  console.log(`📚 API 文档: http://localhost:${port}/api/docs`)
}
bootstrap()
