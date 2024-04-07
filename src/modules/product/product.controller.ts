import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { UpdateProductDTO } from './dto/update-product.dto';
import { CreateProductDTO } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { ListProductDTO } from './dto/list-product.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ProductEntity } from './entities/product.entity';
import { CustomLogger } from '../customLogger/logger.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setContext(ProductController.name);
  }

  @Post()
  async createProduct(@Body() createProductDTO: CreateProductDTO) {
    const product = await this.productService.createProduct(
      createProductDTO,
    );

    this.logger.logfile(product)

    return {
      message: 'Produto criado com sucesso.',
      product: product,
    };
  }

  @Get()
  async listProducts() {
    let products = await this.cacheManager.get<ListProductDTO[]>('products')

    if (!products) {
      products = await this.productService.listProducts();

      await this.cacheManager.set('products', products);
    }

    return products;
  }

  @Get('/:id')
  async findProductById(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    let product = await this.cacheManager.get<ProductEntity>(`product-${id}`);

    if (!product) {
      product = await this.productService.findProductById(id);

      await this.cacheManager.set(`product-${id}`, product);
    }

    return new ListProductDTO(
      product.id, 
      product.name, 
      product.amountAvailable,
      product.features,
      product.images
    );
  }

  @Patch('/:id')
  async updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
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
  async removeProduct(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    await this.findProductById(id);

    await this.productService.removeProduct(id);

    return {message: 'produto removido com sucesso'};
  }
}
