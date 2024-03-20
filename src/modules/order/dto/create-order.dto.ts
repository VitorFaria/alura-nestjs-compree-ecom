import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsUUID, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class OrderItemDTO {
  @IsUUID()
  productId: string;

  @IsInt()
  @IsNotEmpty({ message: "Quantidade não pode ser vazio" })
  quantity: number;
}


export class CreateOrderDto {
  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => OrderItemDTO)
  orderItems: OrderItemDTO[];
}
