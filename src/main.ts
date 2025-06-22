import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for your frontend application
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173', // Dynamic frontend origin with fallback
                                    // For example, if your frontend runs on port 4200 (Angular) or 3000 (React/Vite)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow common HTTP methods
    credentials: true, // Allow sending cookies or authorization headers
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
