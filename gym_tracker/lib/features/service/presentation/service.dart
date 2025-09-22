import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/products/presentation/products_page.dart';
import 'package:gym_tracker/features/products/widgets/build_category_button.dart';
import 'package:gym_tracker/features/service/widget/build_service_grid.dart';
import 'package:gym_tracker/models/service.dart';
import 'package:gym_tracker/repositories/service.dart';
import 'package:gym_tracker/services/service.dart';

class Service extends StatefulWidget {
  const Service({super.key});

  @override
  State<StatefulWidget> createState() => _ServicePageState();
}

class _ServicePageState extends State<Service> {
  final ServiceService service = ServiceService();
  late final ServiceRepository _repository = ServiceRepository(service);
  List<ServiceModel> _services = [];
  bool _isLoading = true;
  final String _selectedCategory = 'servicios';
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  Future<void> _loadProducts() async {
    setState(() => _isLoading = true);
    try {
      final services = await _repository.getServices();
      setState(() {
        _services = services;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
        _errorMessage = e.toString();
      });
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
                    'Servicios',
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
                            onTap: () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => const ProductsPage(),
                                ),
                              );
                            },
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: BuildCategoryButton(
                            title: 'Servicios',
                            category: 'servicios',
                            selectedCategory: _selectedCategory,
                            onTap: () {},
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
                  : _errorMessage != null
                  ? Center(
                      child: Text(
                        _errorMessage!,
                        style: GoogleFonts.workSans(
                          fontSize: 18,
                          color: Colors.grey,
                        ),
                      ),
                    )
                  : BuildServiceGrid(
                    services: _services,
                    ),
            ),
          ),
        ],
      ),
    );
  }
}
