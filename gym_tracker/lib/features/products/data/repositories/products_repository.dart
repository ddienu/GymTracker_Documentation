import '../models/product_model.dart';

class ProductsRepository {
  // Datos de ejemplo basados en la imagen
  static List<ProductModel> getMockProducts() {
    return [
      ProductModel(
        id: '1',
        name: 'Pre-Workout',
        description: 'Suplemento pre-entreno para maximizar tu rendimiento',
        price: 225000,
        imageUrl: 'assets/productos/pre_workout.png',
        category: 'supplements',
      ),
      ProductModel(
        id: '2',
        name: 'Proteína Whey',
        description: 'Potencia tus Resultados con la Proteína #1 del Mundo 🥇\n\n¡Ya en nuestra tienda! Gold Standard 100% Whey de ON.\n\nLa clave para llevar tu entrenamiento al siguiente nivel.\n\n✅ RECUPERACIÓN MÁS RÁPIDA\nDile adiós al dolor post-entreno y prepárate para tu próxima sesión.\n\n💪 MÁS MÚSCULO Y FUERZA\nCon 24g de proteína y 5.5g de BCAAs por porción para construir masa magra.\n\n😋 SABOR INCREÍBLE Y FÁCIL DE MEZCLAR\nEl batido perfecto que disfrutarás como una recompensa.\n\n¿Listo para ver resultados reales? ¡Pídela hoy en la tienda de tu gimnasio!',
        price: 110000,
        imageUrl: 'assets/productos/whey_protein.png',
        category: 'supplements',
      ),
      ProductModel(
        id: '3',
        name: 'Amino Energy',
        description: 'Aminoácidos esenciales con energía',
        price: 70000,
        imageUrl: 'assets/productos/amino_energy.png',
        category: 'supplements',
      ),
      ProductModel(
        id: '4',
        name: 'Creatina',
        description: 'Creatina monohidrato pura',
        price: 120000,
        imageUrl: 'assets/productos/creatine.png',
        category: 'supplements',
      ),
    ];
  }

  Future<List<ProductModel>> getProducts() async {
    // Simular delay de red
    await Future.delayed(const Duration(milliseconds: 500));
    return getMockProducts();
  }

  Future<List<ProductModel>> getProductsByCategory(String category) async {
    await Future.delayed(const Duration(milliseconds: 300));
    final products = getMockProducts();
    return products.where((product) => product.category == category).toList();
  }

  Future<ProductModel?> getProductById(String id) async {
    await Future.delayed(const Duration(milliseconds: 200));
    final products = getMockProducts();
    try {
      return products.firstWhere((product) => product.id == id);
    } catch (e) {
      return null;
    }
  }
}