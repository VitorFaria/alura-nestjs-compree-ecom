import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './enum/OrderStatus.enum';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Query('userId') userId: string, @Body() createOrderDTO: CreateOrderDto) {
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Get('/user/:userId')
  async findOrdersByUser(
    @Param('userId', ParseUUIDPipe) userId: string
  ) {
    const userOrders = await this.orderService.findOrdersByUser(userId);
    return userOrders;
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
