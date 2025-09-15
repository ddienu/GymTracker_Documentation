import 'package:flutter_test/flutter_test.dart';
import 'package:gym_tracker/features/products/data/models/product_model.dart';
import 'package:gym_tracker/features/products/data/repositories/products_repository.dart';

void main() {
  group('Products Module Tests', () {
    test('ProductModel should create from JSON correctly', () {
      final json = {
        'id': '1',
        'name': 'Test Product',
        'description': 'Test Description',
        'price': 100.0,
        'imageUrl': 'test_image.png',
        'category': 'supplements',
        'isAvailable': true,
      };

      final product = ProductModel.fromJson(json);

      expect(product.id, '1');
      expect(product.name, 'Test Product');
      expect(product.description, 'Test Description');
      expect(product.price, 100.0);
      expect(product.imageUrl, 'test_image.png');
      expect(product.category, 'supplements');
      expect(product.isAvailable, true);
    });

    test('ProductModel should convert to JSON correctly', () {
      final product = ProductModel(
        id: '1',
        name: 'Test Product',
        description: 'Test Description',
        price: 100.0,
        imageUrl: 'test_image.png',
        category: 'supplements',
        isAvailable: true,
      );

      final json = product.toJson();

      expect(json['id'], '1');
      expect(json['name'], 'Test Product');
      expect(json['description'], 'Test Description');
      expect(json['price'], 100.0);
      expect(json['imageUrl'], 'test_image.png');
      expect(json['category'], 'supplements');
      expect(json['isAvailable'], true);
    });

    test('ProductsRepository should return mock products', () async {
      final repository = ProductsRepository();
      final products = await repository.getProducts();

      expect(products.length, 4);
      expect(products[0].name, 'Pre-Workout');
      expect(products[1].name, 'Proteína Whey');
      expect(products[2].name, 'Amino Energy');
      expect(products[3].name, 'Creatina');
    });

    test('ProductsRepository should find product by ID', () async {
      final repository = ProductsRepository();
      final product = await repository.getProductById('1');

      expect(product, isNotNull);
      expect(product!.name, 'Pre-Workout');
      expect(product.price, 225000);
    });

    test('ProductsRepository should return null for non-existent ID', () async {
      final repository = ProductsRepository();
      final product = await repository.getProductById('999');

      expect(product, isNull);
    });
  });
}