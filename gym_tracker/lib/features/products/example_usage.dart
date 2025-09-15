// Ejemplo de uso del módulo de productos

import 'package:flutter/material.dart';
import 'data/models/product_model.dart';
import 'data/repositories/products_repository.dart';
import 'presentation/products_page.dart';
import 'presentation/product_detail_page.dart';

class ProductsExampleUsage {
  
  // Ejemplo 1: Navegar a la página de productos
  static void navigateToProducts(BuildContext context) {
    Navigator.pushNamed(context, 'products');
    // O usando MaterialPageRoute:
    // Navigator.push(
    //   context,
    //   MaterialPageRoute(builder: (context) => const ProductsPage()),
    // );
  }

  // Ejemplo 2: Obtener productos del repositorio
  static Future<void> loadProducts() async {
    final repository = ProductsRepository();
    
    // Obtener todos los productos
    final products = await repository.getProducts();
    print('Total productos: ${products.length}');
    
    // Obtener productos por categoría
    final supplements = await repository.getProductsByCategory('supplements');
    print('Suplementos: ${supplements.length}');
    
    // Obtener producto específico
    final product = await repository.getProductById('1');
    if (product != null) {
      print('Producto encontrado: ${product.name}');
    }
  }

  // Ejemplo 3: Crear un producto personalizado
  static ProductModel createCustomProduct() {
    return ProductModel(
      id: '5',
      name: 'BCAA',
      description: 'Aminoácidos de cadena ramificada',
      price: 85000,
      imageUrl: 'assets/productos/bcaa.png',
      category: 'supplements',
      isAvailable: true,
    );
  }

  // Ejemplo 4: Navegar al detalle de un producto
  static void navigateToProductDetail(BuildContext context, ProductModel product) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => ProductDetailPage(product: product),
      ),
    );
  }

  // Ejemplo 5: Formatear precio
  static String formatPrice(double price) {
    return price.toStringAsFixed(0).replaceAllMapped(
      RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'),
      (Match m) => '${m[1]}.',
    );
  }

  // Ejemplo 6: Widget personalizado usando ProductCard
  static Widget buildCustomProductGrid(List<ProductModel> products) {
    return GridView.builder(
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.75,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
      ),
      itemCount: products.length,
      itemBuilder: (context, index) {
        return Container(
          // Aquí puedes usar ProductCard o crear tu propio widget
          child: Text(products[index].name),
        );
      },
    );
  }
}