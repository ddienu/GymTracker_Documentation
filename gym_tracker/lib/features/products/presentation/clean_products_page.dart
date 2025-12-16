import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import '../data/models/product_model.dart';
import '../data/services/mock_data_service.dart';
import 'widgets/product_card.dart';
import 'dart:convert';
import 'dart:developer' as developer;

/// Clean products page with original design and API connectivity
class CleanProductsPage extends StatefulWidget {
  const CleanProductsPage({super.key});

  @override
  State<CleanProductsPage> createState() => _CleanProductsPageState();
}

class _CleanProductsPageState extends State<CleanProductsPage> {
  List<ProductModel> _products = [];
  bool _isLoading = true;
  String? _errorMessage;
  bool _hasError = false;
  bool _usingApiData = false;
  String _selectedCategory = 'productos'; // 'productos' o 'servicios'

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  Future<void> _loadProducts() async {
    setState(() {
      _isLoading = true;
      _hasError = false;
      _errorMessage = null;
      _usingApiData = false;
    });

    // Try multiple endpoints for maximum compatibility
    final endpoints = [
      'http://192.168.0.16:3000/api/products',  // Android emulator
      'http://localhost:3000/api/products',  // iOS simulator / Desktop
      'http://127.0.0.1:3000/api/products',  // Alternative localhost
    ];

    for (final endpoint in endpoints) {
      try {
        developer.log('Trying endpoint: $endpoint', name: 'CleanProductsPage');

        final response = await http.get(
          Uri.parse(endpoint),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        ).timeout(const Duration(seconds: 8));

        if (response.statusCode == 200) {
          final List<dynamic> jsonList = jsonDecode(response.body);
          developer.log(
            'SUCCESS: Loaded ${jsonList.length} items from $endpoint',
            name: 'CleanProductsPage',
          );
          
          final products = jsonList
              .map((json) => ProductModel.fromApi(json as Map<String, dynamic>))
              .toList();

          setState(() {
            _products = products;
            _isLoading = false;
            _hasError = false;
            _usingApiData = true;
          });

          developer.log(
            'Successfully loaded ${products.length} products from API',
            name: 'CleanProductsPage',
          );
          return;
        }
      } catch (e) {
        developer.log(
          'Failed with $endpoint: $e',
          name: 'CleanProductsPage',
        );
        continue; // Try next endpoint
      }
    }

    // All endpoints failed, use mock data
    try {
      developer.log('All API endpoints failed, loading mock data', name: 'CleanProductsPage');
      final products = await MockDataService.getFallbackProductsWithDelay();

      setState(() {
        _products = products;
        _isLoading = false;
        _hasError = false;
        _usingApiData = false;
      });

      developer.log(
        'Successfully loaded ${products.length} mock products',
        name: 'CleanProductsPage',
      );
    } catch (e) {
      setState(() {
        _isLoading = false;
        _hasError = true;
        _errorMessage = 'Error cargando productos: $e';
      });
    }
  }

  void _retryLoading() {
    _loadProducts();
  }

  Widget _buildCategoryButton(String title, String category, bool isSelected) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedCategory = category;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFFF6B35) : Colors.transparent,
          borderRadius: BorderRadius.circular(25),
          border: Border.all(
            color: const Color(0xFFFF6B35),
            width: 2,
          ),
        ),
        child: Center(
          child: Text(
            title,
            style: GoogleFonts.workSans(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: isSelected ? Colors.white : const Color(0xFFFF6B35),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: Column(
        children: [
          // Header section with gym equipment background
          Container(
            decoration: const BoxDecoration(
              color: Colors.white,
              image: DecorationImage(
                image: AssetImage('assets/gym_background.png'),
                fit: BoxFit.cover,
              ),
            ),
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.7),
              ),
              child: SafeArea(
                child: Column(
                  mainAxisSize: MainAxisSize.min, // Importante: usar min en lugar de max
                  children: [
                    // Back button area
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
                      child: Row(
                        children: [
                          IconButton(
                            onPressed: () => Navigator.pop(context),
                            icon: const Icon(
                              Icons.arrow_back_ios,
                              color: Colors.black,
                              size: 24,
                            ),
                          ),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 8),
                    
                    // Title
                    Text(
                      'Productos',
                      style: GoogleFonts.workSans(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),
                    
                    const SizedBox(height: 12),
                    
                    // Category buttons
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 40),
                      child: Row(
                        children: [
                          Expanded(
                            child: _buildCategoryButton(
                              'Productos',
                              'productos',
                              _selectedCategory == 'productos',
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: _buildCategoryButton(
                              'Servicios',
                              'servicios',
                              _selectedCategory == 'servicios',
                            ),
                          ),
                        ],
                      ),
                    ),
                    
                    const SizedBox(height: 12),
                  ],
                ),
              ),
            ),
          ),

          // Products content
          Expanded(
            child: Container(
              color: Colors.grey[100],
              child: _isLoading
                  ? const Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          CircularProgressIndicator(),
                          SizedBox(height: 16),
                          Text('Cargando productos...'),
                        ],
                      ),
                    )
                  : _hasError
                  ? _buildErrorView()
                  : _buildProductsGrid(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductsGrid() {
    // Filter products based on selected category
    List<ProductModel> filteredProducts = _products.where((product) {
      final description = product.description ?? '';
      if (_selectedCategory == 'productos') {
        // Show products (not services)
        return !description.contains('[SERVICE_ID:');
      } else {
        // Show services
        return description.contains('[SERVICE_ID:');
      }
    }).toList();

    if (_products.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.inventory_2_outlined, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              'No hay productos disponibles',
              style: GoogleFonts.workSans(
                fontSize: 18,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: _retryLoading,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFF6B35),
                foregroundColor: Colors.white,
              ),
              child: const Text('Reintentar'),
            ),
          ],
        ),
      );
    }

    if (filteredProducts.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              _selectedCategory == 'productos' ? Icons.inventory_2_outlined : Icons.room_service_outlined,
              size: 64,
              color: Colors.grey[400],
            ),
            const SizedBox(height: 16),
            Text(
              _selectedCategory == 'productos' 
                  ? 'No hay productos disponibles'
                  : 'No hay servicios disponibles',
              style: GoogleFonts.workSans(
                fontSize: 18,
                color: Colors.grey[600],
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _usingApiData 
                  ? 'Conectado al API - ${_products.length} items totales'
                  : 'Usando datos de prueba',
              style: GoogleFonts.workSans(
                fontSize: 14,
                color: Colors.grey[500],
              ),
            ),
          ],
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.all(16),
      child: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.75,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: filteredProducts.length,
        itemBuilder: (context, index) {
          return ProductCard(product: filteredProducts[index]);
        },
      ),
    );
  }

  Widget _buildErrorView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 64, color: Colors.grey[400]),
            const SizedBox(height: 16),
            Text(
              _errorMessage ?? 'Error desconocido',
              style: GoogleFonts.workSans(
                fontSize: 16,
                color: Colors.grey[600],
                height: 1.5,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _retryLoading,
              icon: const Icon(Icons.refresh, color: Colors.white),
              label: Text(
                'Reintentar',
                style: GoogleFonts.workSans(
                  fontSize: 16,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFF6B35),
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 12,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(25),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
