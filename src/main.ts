import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APP_PORT, CONFIG_PREFIX } from '@common/configs/env';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix(CONFIG_PREFIX || 'api/v1');


  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
    }),
  );

  // SWAGGER CONFIG
  const config = new DocumentBuilder()
    .setTitle('API for Threaders clone')
    .setDescription('The app API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(APP_PORT);
}
bootstrap()
  .then(() => {
    Logger.log(`Listening on port ${APP_PORT}`, 'NestApplication');
  })
  .catch((e) => {
    Logger.error(`❌ Error starting server, ${e}`, '', 'Bootstrap', false);
    throw e;
  });
