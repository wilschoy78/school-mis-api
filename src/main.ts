import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set a global prefix for all routes
  app.setGlobalPrefix('api');

  // Enable CORS for your frontend application
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:8080', // Dynamic frontend origin with fallback
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow common HTTP methods
    credentials: true, // Allow sending cookies or authorization headers
  });

  // Add global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('School MIS API')
    .setDescription('The School MIS API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => console.error(err));
