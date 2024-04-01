import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { PostgresConfigService } from './config/postgres.config.service';
import { OrderModule } from './modules/order/order.module';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilterGlobal } from './resources/filters/exception-filter-global';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

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
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({ ttl: 10 * 1000 })
      }),
      isGlobal: true,
    })
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionFilterGlobal
    }
  ]
})
export class AppModule {}
