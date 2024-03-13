import { IsEnum } from 'class-validator';
import { OrderStatus } from '../enum/OrderStatus.enum';

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  orderStatus: OrderStatus;
}
