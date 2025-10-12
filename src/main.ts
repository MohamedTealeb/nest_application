import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port=process.env.PORT ?? 5000
  const app = await NestFactory.create(AppModule);
  await app.listen(port,()=>{
    console.log(`Application is running on: ${port}`);
  });
}
bootstrap();
