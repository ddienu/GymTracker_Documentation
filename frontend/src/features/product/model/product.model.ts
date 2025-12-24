import { ProductDto } from './dto/product.dto';

export interface ProductModel {
  productId: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  imageUrl: string;
  isActive: boolean;
}

export function mapProductDtoToProductModel(
  productDto: ProductDto
): ProductModel {
  return {
    productId: productDto.product_id,
    name: productDto.name,
    description: productDto.description,
    price: parseFloat(productDto.price),
    stock: productDto.stock,
    sku: productDto.sku,
    imageUrl: productDto.image_url, // 👈 queda solo camelCase
    isActive: productDto.is_active === 1,
  };
}

export function mapProductsDtoToProductModels(
  productDtos: ProductDto[]
): ProductModel[] {
  return productDtos.map(mapProductDtoToProductModel);
}
