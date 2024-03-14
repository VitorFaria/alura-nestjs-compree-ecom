import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { PostgresConfigService } from './config/postgres.config.service';
import { OrderModule } from './order/order.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilterGlobal } from './filters/exception-filter-global';

@Module({
  imports: [
    UserModule,
    ProductModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
      inject: [PostgresConfigService],
    }),
    OrderModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionFilterGlobal
    }
  ]
})
export class AppModule {}
