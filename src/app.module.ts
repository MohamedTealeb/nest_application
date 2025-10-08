import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { resolve } from 'path';
import { UserModule } from './user/user.module';
import { CatrgoryModule } from './catrgory/catrgory.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve("./config/.env"),
      isGlobal: true
    }),
    AuthModule,
    UserModule,
    CatrgoryModule,
    ProductModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
