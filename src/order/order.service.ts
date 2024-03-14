import { UserEntity } from '../user/entities/user.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { In, Repository } from 'typeorm';
import { OrderStatus } from './enum/OrderStatus.enum';
import { OrderItemEntity } from './entities/orderItem.entity';
import { ProductEntity } from '../product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity) private readonly orderRepository: Repository<OrderEntity>, 
    @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity) private readonly productRepository: Repository<ProductEntity>,
  ) {}

  private async findUserById(userId: string) {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });

      if (!user) throw new NotFoundException("User not found");

      return user;
    } catch (err) {
      throw err;
    }
  }

  private handleOrderData(createOrderDto: CreateOrderDto, relatedProducts: ProductEntity[]) {
    createOrderDto.orderItems.forEach((orderItem) => {
      const relatedProduct = relatedProducts.find((product) => product.id === orderItem.productId);

      if (relatedProduct === undefined) throw new NotFoundException(`Product with id ${orderItem.productId} was not found`);


      if (relatedProduct.amountAvailable < orderItem.quantity) {
        throw new BadRequestException(`A quantidade solicitada (${orderItem.quantity}) 
          é maior do que a disponível (${relatedProduct.amountAvailable}) para este produto`);
      }
    })
  }

  async createOrder(userId: string, createOrderDTO: CreateOrderDto) {
    try {
      const user = await this.findUserById(userId);
      const productIds = createOrderDTO.orderItems.map((orderItem) => orderItem.productId)
  
      const productsWithinOrder = await this.productRepository.findBy({ id: In(productIds) })
      const orderEntity = new OrderEntity()
  
      orderEntity.orderStatus = OrderStatus.PROCESSING
      orderEntity.user = user

      this.handleOrderData(createOrderDTO, productsWithinOrder);
  
      const orderItemsEntities = createOrderDTO.orderItems.map((orderItem) => {
        const relatedProduct = productsWithinOrder.find((product) => product.id === orderItem.productId)
        const orderItemEntity = new OrderItemEntity()
  
        orderItemEntity.product = relatedProduct!
        orderItemEntity.salePrice = relatedProduct!.value
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

    } catch (err) {
      throw err;
    }
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.orderRepository.findOneBy({id});
  
      if (!order) throw new NotFoundException("Order not found");
      
      Object.assign(order, updateOrderDto);
      return await this.orderRepository.save(order);

    } catch (err) {
      throw err;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
