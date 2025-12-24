import 'package:gym_tracker/models/product.dart';
import 'package:gym_tracker/services/product_service.dart';

class ProductRepository{
  final ProductService productService;

  ProductRepository(this.productService);

  Future<List<Product>> getProducts() async {
      final jsonList = await productService.getProducts();
      return jsonList.map((json) => Product.fromJson(json)).toList();
  }
}