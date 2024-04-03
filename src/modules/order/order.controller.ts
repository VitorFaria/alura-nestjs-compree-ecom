import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, Request, Inject } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './enum/OrderStatus.enum';
import { AuthGuard, UserRequest } from '../auth/auth.guard';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { OrderEntity } from './entities/order.entity';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Post()
  async createOrder(@Request() req: UserRequest, @Body() createOrderDTO: CreateOrderDto) {
    const userId = req.user.sub;
    const order = await this.orderService.createOrder(userId, createOrderDTO);

    return order;
  }

  // @Get()
  // async findByFilter(
  //   @Query('orderStatus') orderStatus: OrderStatus,
  //   @Query('user') userName: string
  // ) {
    
  //   const orders = await this.orderService.findByFilter(orderStatus, userName);

  //   return orders;
  // }

  @Get('/user')
  async findOrdersByUser(
    @Request() req: UserRequest
  ) {
    const userId = req.user.sub;
    let userOrders = await this.cacheManager.get<OrderEntity[]>('userOrders');

    if (!userOrders) {
      userOrders = await this.orderService.findOrdersByUser(userId);

      await this.cacheManager.set('userOrders', userOrders);
    }

    return userOrders;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Request() req: UserRequest, @Body() updateOrderDto: UpdateOrderDto) {
    const userId = req.user.sub;
    return this.orderService.updateOrder(id, userId, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
