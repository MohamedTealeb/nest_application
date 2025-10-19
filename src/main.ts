import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setDefaultLanguage } from './common/middleware/setDefualtLanguage';
import { LoggingInterceptor } from './common/interceptors/watchReauest.interceptor';

async function bootstrap() {
  const port=process.env.PORT ?? 5000
  const app = await NestFactory.create(AppModule);
  app.use(setDefaultLanguage)
  app.useGlobalInterceptors(new LoggingInterceptor)
  await app.listen(port,()=>{
    console.log(`Application is running on: ${port}`);
  });
}
bootstrap();
