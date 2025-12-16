import '../models/product_model.dart';

/// Service for providing fallback mock data when API is unavailable
/// This is kept separate to maintain clean architecture and easy removal
class MockDataService {
  /// Provides fallback product data for when API is unavailable
  /// This should only be used as a last resort fallback
  static List<ProductModel> getFallbackProducts() {
    return [
      ProductModel(
        legacyId: '1',
        name: 'Pre-Workout',
        description: 'Suplemento pre-entreno para maximizar tu rendimiento',
        price: 225000,
        imageUrl: 'assets/productos/pre_workout.png',
        category: 'supplements',
      ),
      ProductModel(
        legacyId: '2',
        name: 'Proteína Whey',
        description: 'Potencia tus Resultados con la Proteína #1 del Mundo 🥇',
        price: 110000,
        imageUrl: 'assets/productos/whey_protein.png',
        category: 'supplements',
      ),
      ProductModel(
        legacyId: '3',
        name: 'Amino Energy',
        description: 'Aminoácidos esenciales con energía',
        price: 70000,
        imageUrl: 'assets/productos/amino_energy.png',
        category: 'supplements',
      ),
      ProductModel(
        legacyId: '4',
        name: 'Creatina',
        description: 'Creatina monohidrato pura',
        price: 120000,
        imageUrl: 'assets/productos/creatine.png',
        category: 'supplements',
      ),
    ];
  }

  /// Simulates network delay for mock data to provide realistic UX
  static Future<List<ProductModel>> getFallbackProductsWithDelay() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return getFallbackProducts();
  }

  /// Gets a fallback product by ID
  static Future<ProductModel?> getFallbackProductById(String id) async {
    await Future.delayed(const Duration(milliseconds: 200));
    final products = getFallbackProducts();
    try {
      return products.firstWhere((product) => product.id == id);
    } catch (e) {
      return null;
    }
  }

  /// Gets fallback products by category
  static Future<List<ProductModel>> getFallbackProductsByCategory(
    String category,
  ) async {
    await Future.delayed(const Duration(milliseconds: 250));
    final products = getFallbackProducts();
    return products.where((product) => product.category == category).toList();
  }
}
