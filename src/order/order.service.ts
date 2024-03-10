import { UserEntity } from './../user/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from './enum/OrderStatus.enum';
import { OrderItemEntity } from './entities/orderItem.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>, 
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createOrder(userId: string, createOrderDTO: CreateOrderDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    const orderEntity = new OrderEntity();

    orderEntity.orderStatus = OrderStatus.PROCESSING
    orderEntity.user = user;

    const orderItemsEntities = createOrderDTO.orderItems.map((orderItem) => {
      const orderItemEntity = new OrderItemEntity()

      orderItemEntity.salePrice = 10
      orderItemEntity.quantity = orderItem.quantity

      return orderItemEntity;
    })

    const totalValue = orderItemsEntities.reduce((total, item) => {
      return total + item.salePrice * item.quantity;
    }, 0);

    orderEntity.orderItems = orderItemsEntities;

    orderEntity.totalValue = totalValue;

    const order = await this.orderRepository.save(orderEntity);

    return order;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
