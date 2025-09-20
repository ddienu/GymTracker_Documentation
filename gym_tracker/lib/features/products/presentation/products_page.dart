import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/products/widgets/build_category_button.dart';
import 'package:gym_tracker/models/product.dart';
import 'package:gym_tracker/repositories/product.dart';
import 'package:gym_tracker/services/product_service.dart';
// import '../data/models/product_model.dart';
// import '../data/repositories/products_repository.dart';
import '../widgets/product_card.dart';

class ProductsPage extends StatefulWidget {
  const ProductsPage({super.key});

  @override
  State<ProductsPage> createState() => _ProductsPageState();
}

class _ProductsPageState extends State<ProductsPage> {
  final ProductService productService = ProductService();
  late final ProductRepository _repository = ProductRepository(productService);
  List<Product> _products = [];
  bool _isLoading = true;
  String _selectedCategory = 'productos';

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  Future<void> _loadProducts() async {
    setState(() => _isLoading = true);
    try {
      final products = await _repository.getProducts();
      setState(() {
        _products = products;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      // Handle error5
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: Column(
        children: [
          // Header section with gym background
          Container(
            height: 205,
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: AssetImage('assets/gym_background.png'),
                fit: BoxFit.cover,
                opacity: 0.7,
              ),
            ),
            child: SafeArea(
              child: Column(
                children: [
                  // AppBar content
                  const SizedBox(
                    height: 15,
                  ), // Extra space to lower the back button
                  Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    child: Row(
                      children: [
                        IconButton(
                          icon: const Icon(
                            Icons.arrow_back,
                            color: Colors.black,
                          ),
                          onPressed: () => Navigator.pop(context),
                        ),
                        const SizedBox(width: 48), // Balance the back button
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  // Title positioned lower
                  Text(
                    'Productos',
                    style: GoogleFonts.workSans(
                      color: Colors.black,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const Spacer(),
                  // Category buttons
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
                    child: Row(
                      children: [
                        Expanded(
                          child: BuildCategoryButton(
                            title: 'Productos',
                            category: 'productos',
                            selectedCategory: _selectedCategory,
                            onCategorySelected: (category) {
                              setState(() {
                                _selectedCategory = category;
                              });
                            },
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: BuildCategoryButton(
                            title: 'Servicios',
                            category: 'servicios',
                            selectedCategory: _selectedCategory,
                            onCategorySelected: (category) {
                              setState(() {
                                _selectedCategory = category;
                              });
                            },
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          // Products grid section with clean background
          Expanded(
            child: Container(
              color: Colors.grey[100],
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _selectedCategory == 'productos'
                  ? _buildProductsGrid()
                  : _buildServicesView(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductsGrid() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          childAspectRatio: 0.75,
          crossAxisSpacing: 16,
          mainAxisSpacing: 16,
        ),
        itemCount: _products.length,
        itemBuilder: (context, index) {
          return ProductCard(product: _products[index]);
        },
      ),
    );
  }

  Widget _buildServicesView() {
    return Center(
      child: Text(
        'Servicios próximamente',
        style: GoogleFonts.workSans(fontSize: 18, color: Colors.grey),
      ),
    );
  }
}
