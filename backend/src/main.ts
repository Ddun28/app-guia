import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('ALLOWED_ORIGINS').split(','),
    methods: configService.get('ALLOWED_METHODS').split(','),
    credentials: configService.get('CORS_CREDENTIALS') === 'true',
    allowedHeaders: configService.get('ALLOWED_HEADERS').split(','),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(configService.get('PORT') || 3000);

}
bootstrap();