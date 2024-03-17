import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListProductDTO } from './dto/list-product.dto';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDTO } from './dto/update-product.dto';
import { CreateProductDTO } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async createProduct(createProductDTO: CreateProductDTO) {
    try {
      const productEntity = new ProductEntity();
  
      Object.assign(productEntity, createProductDTO as ProductEntity)
  
      const product = await this.productRepository.save(productEntity); 

      return product;
    } catch (err) {
      throw err;
    }
  }

  async listProducts() {
    try {
      const products = await this.productRepository.find({
        relations: {
          images: true,
          features: true,
        },
      });
      const mappedProducts = products.map(
        (product) =>
          new ListProductDTO(
            product.id,
            product.name,
            product.amountAvailable,
            product.features,
            product.images,
          ),
      );
      return mappedProducts;

    } catch (err) {
      throw err;
    }
  }

  async findProductById(id: string) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) throw new NotFoundException(`Product with ${id} not found`);

    return product;
  }

  async updateProduct(id: string, updateProductDTO: UpdateProductDTO) {
    try {
      const product = await this.productRepository.findOneBy({ id });
  
      if (!product) throw new NotFoundException("Product not found");
  
      Object.assign(product, updateProductDTO as ProductEntity);
      return this.productRepository.save(product);
    } catch(err) {
      throw err;
    }
  }

  async removeProduct(id: string) {
    await this.findProductById(id);

    await this.productRepository.delete(id);
  }
}
