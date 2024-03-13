import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListProductDTO } from './dto/ListProduct.dto';
import { ProductEntity } from './product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDTO } from './dto/UpdateProduct.dto';
import { CreateProductDTO } from './dto/CreateProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async createProduct(createProductDTO: CreateProductDTO) {
    const productEntity = new ProductEntity();

    productEntity.name = createProductDTO.name;
    productEntity.value = createProductDTO.value;
    productEntity.amountAvailable = createProductDTO.amountAvailable;
    productEntity.description = createProductDTO.description;
    productEntity.category = createProductDTO.category;
    productEntity.features = createProductDTO.features;
    productEntity.images = createProductDTO.images;

    return this.productRepository.save(productEntity);
  }

  async listProducts() {
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
          product.features,
          product.images,
        ),
    );
    return mappedProducts;
  }

  async updateProduct(id: string, updateProductDTO: UpdateProductDTO) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) throw new NotFoundException("Product not found");

    Object.assign(product, updateProductDTO);
    return this.productRepository.save(product);
  }

  async removeProduct(id: string) {
    await this.productRepository.delete(id);
  }
}
