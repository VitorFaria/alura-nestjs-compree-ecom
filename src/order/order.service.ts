import { UserEntity } from './../user/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { In, Repository } from 'typeorm';
import { OrderStatus } from './enum/OrderStatus.enum';
import { OrderItemEntity } from './entities/orderItem.entity';
import { ProductEntity } from '../product/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>, 
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
  ) {}

  private async findUserById(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new NotFoundException("User not found");

    return user;
  }

  async createOrder(userId: string, createOrderDTO: CreateOrderDto) {
    const user = await this.findUserById(userId);
    const productIds = createOrderDTO.orderItems.map((orderItem) => orderItem.productId)

    const productsInOrder = await this.productRepository.findBy({ id: In(productIds) })
    const orderEntity = new OrderEntity()

    orderEntity.orderStatus = OrderStatus.PROCESSING
    orderEntity.user = user

    const orderItemsEntities = createOrderDTO.orderItems.map((orderItem) => {
      const relatedProduct = productsInOrder.find((product) => product.id === orderItem.productId)

      if (relatedProduct === undefined) throw new NotFoundException(`Product with id ${orderItem.productId} was not found`);

      const orderItemEntity = new OrderItemEntity()

      orderItemEntity.product = relatedProduct
      orderItemEntity.salePrice = relatedProduct.value
      orderItemEntity.quantity = orderItem.quantity
      orderItemEntity.product.amountAvailable -= orderItem.quantity

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

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepository.findOneBy({id});

    if (!order) throw new NotFoundException("Order not found");
    
    Object.assign(order, updateOrderDto);
    return await this.orderRepository.save(order);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
