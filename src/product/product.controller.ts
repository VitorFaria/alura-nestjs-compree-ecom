import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { UpdateProductDTO } from './dto/UpdateProduct.dto';
import { CreateProductDTO } from './dto/CreateProduct.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() createProductDTO: CreateProductDTO) {
    const product = await this.productService.createProduct(
      createProductDTO,
    );

    return {
      message: 'Produto criado com sucesso.',
      product: product,
    };
  }

  @Get()
  async listProducts() {
    return this.productService.listProducts();
  }

  @Put('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDTO: UpdateProductDTO,
  ) {
    const product = await this.productService.updateProduct(
      id,
      updateProductDTO,
    );

    return {
      message: 'produto atualizado com sucesso',
      produto: product,
    };
  }

  @Delete('/:id')
  async removeProduct(@Param('id') id: string) {
    await this.productService.removeProduct(id);

    return 'produto removido com sucesso';
  }
}
