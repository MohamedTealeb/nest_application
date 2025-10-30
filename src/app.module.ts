import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { resolve } from 'path';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandModule } from './modules/brand/brand.module';
import { CategoryModule } from './modules/category/category.module';
import { CartModule } from './modules/cart/cart.module';

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
    ProductModule,
    CategoryModule,
    CartModule,
    
    
    
  ],
  controllers: [AppController ],
  providers: [AppService ],
  
  
  
  
})
export class AppModule {}
