import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { resolve } from 'path';
import { UserModule } from './user/user.module';
import { CatrgoryModule } from './catrgory/catrgory.module';
import { ProductModule } from './product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandModule } from './brand/brand.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve("./config/.env"),
      isGlobal: true,
      
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/application' ,{serverSelectionTimeoutMS:5000}),
    AuthModule,
    UserModule,
    BrandModule,
    CatrgoryModule,
    ProductModule,
    
    
    
  ],
  controllers: [AppController ],
  providers: [AppService ],
  
  
  
  
})
export class AppModule {}
