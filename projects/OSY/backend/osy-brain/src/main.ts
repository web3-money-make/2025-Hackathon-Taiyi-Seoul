import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Swagger 설정 시작
  const config = new DocumentBuilder()
    .setTitle('My API') // API 제목
    .setDescription('API description') // API 설명
    .setVersion('1.0') // 버전
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api-docs', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
