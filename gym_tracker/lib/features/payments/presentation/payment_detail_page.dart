import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class PaymentDetailPage extends StatelessWidget {
  final String date;
  final String amount;

  const PaymentDetailPage({
    super.key,
    required this.date,
    required this.amount,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: SafeArea(
        child: Column(
          children: [
            // Header con imagen de fondo
            _buildHeader(context),
            
            // Contenido principal
            Expanded(
              child: Container(
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(20),
                    topRight: Radius.circular(20),
                  ),
                ),
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Sección de Productos
                      _buildProductsSection(),
                      
                      const SizedBox(height: 30),
                      
                      // Sección de Servicios
                      _buildServicesSection(),
                      
                      const SizedBox(height: 30),
                      
                      // Precio total
                      _buildTotalSection(),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      height: 200,
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(20),
          bottomRight: Radius.circular(20),
        ),
        image: const DecorationImage(
          image: AssetImage('assets/gym_background.png'),
          fit: BoxFit.cover,
        ),
      ),
      child: Stack(
        children: [
          // Overlay semitransparente
          Container(
            decoration: BoxDecoration(
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(20),
                bottomRight: Radius.circular(20),
              ),
              color: Colors.white.withValues(alpha: 0.3),
            ),
          ),
          
          // Contenido del header
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20),
                
                // Botón de regreso
                GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade200,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      Icons.arrow_back_ios,
                      color: Colors.black,
                      size: 20,
                    ),
                  ),
                ),
                
                const Spacer(),
                
                // Título y fecha centrados
                Center(
                  child: Column(
                    children: [
                      Text(
                        'Detalle de pago',
                        style: GoogleFonts.workSans(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        date,
                        style: GoogleFonts.workSans(
                          fontSize: 16,
                          color: Colors.black87,
                        ),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 20),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductsSection() {
    final products = [
      {
        'name': 'Proteína WheyProtein 1Kg Optimum Nutrition',
        'price': '\$110.000',
        'quantity': '2 Unidades',
        'color': Colors.red,
      },
      {
        'name': 'Aminoácidos Optimum Nutrition',
        'price': '\$70.000',
        'quantity': '1 Unidades',
        'color': Colors.purple,
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Productos',
          style: GoogleFonts.workSans(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
        ),
        const SizedBox(height: 16),
        
        ...products.map((product) => Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.grey.shade100,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              // Icono del producto
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: product['color'] as Color,
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.local_drink,
                  color: Colors.white,
                  size: 30,
                ),
              ),
              
              const SizedBox(width: 12),
              
              // Información del producto
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      product['name'] as String,
                      style: GoogleFonts.workSans(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${product['price']} | ${product['quantity']}',
                      style: GoogleFonts.workSans(
                        fontSize: 14,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        )),
        
        // Subtotal productos
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Orden - 53',
              style: GoogleFonts.workSans(
                fontSize: 14,
                color: Colors.grey.shade600,
              ),
            ),
            Text(
              'Subtotal : \$290.000',
              style: GoogleFonts.workSans(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildServicesSection() {
    final services = [
      {
        'name': 'Sesión con entrenador personal',
        'price': '\$40.000',
        'quantity': '1 Sesión',
        'icon': Icons.fitness_center,
      },
      {
        'name': 'Acceso ilimitado a todas las instalaciones del gimnasio.',
        'price': '\$40.000',
        'quantity': '1 acceso',
        'icon': Icons.accessibility_new,
      },
      {
        'name': 'Consulta nutricional + plan alimentario',
        'price': '\$50.000',
        'quantity': '1 Sesión',
        'icon': Icons.restaurant_menu,
      },
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Servicios',
          style: GoogleFonts.workSans(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
        ),
        const SizedBox(height: 16),
        
        ...services.map((service) => Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.grey.shade100,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              // Icono del servicio
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: Colors.blue.shade400,
                  borderRadius: BorderRadius.circular(25),
                ),
                child: Icon(
                  service['icon'] as IconData,
                  color: Colors.white,
                  size: 25,
                ),
              ),
              
              const SizedBox(width: 12),
              
              // Información del servicio
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      service['name'] as String,
                      style: GoogleFonts.workSans(
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        color: Colors.black,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${service['price']} | ${service['quantity']}',
                      style: GoogleFonts.workSans(
                        fontSize: 14,
                        color: Colors.grey.shade600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        )),
        
        // Subtotal servicios
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Orden - 73',
              style: GoogleFonts.workSans(
                fontSize: 14,
                color: Colors.grey.shade600,
              ),
            ),
            Text(
              'Subtotal : \$130.000',
              style: GoogleFonts.workSans(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildTotalSection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.grey.shade100,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            'Precio total:',
            style: GoogleFonts.workSans(
              fontSize: 18,
              color: Colors.grey.shade600,
            ),
          ),
          Text(
            amount,
            style: GoogleFonts.workSans(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.black,
            ),
          ),
        ],
      ),
    );
  }
}