import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/meal_plan/presentation/meal_detail_page.dart';

class MealPlanPage extends StatefulWidget {
  const MealPlanPage({super.key});

  @override
  State<MealPlanPage> createState() => _MealPlanPageState();
}

class _MealPlanPageState extends State<MealPlanPage> {
  int selectedDay = 12; // Día seleccionado por defecto (Aug 12)

  final List<Map<String, dynamic>> days = [
    {'day': 9, 'label': 'Aug\n09'},
    {'day': 10, 'label': 'Aug\n10'},
    {'day': 11, 'label': 'Aug\n11'},
    {'day': 12, 'label': 'Aug\n12'},
    {'day': 13, 'label': 'Aug\n13'},
  ];

  final List<Map<String, dynamic>> meals = [
    {
      'name': 'Changua',
      'type': 'Desayuno',
      'image': 'assets/meals/changua.png', // Imagen real de changua
    },
    {
      'name': 'Ramen',
      'type': 'Almuerzo',
      'image': 'assets/meals/ramen.png', // Imagen real de ramen
    },
    {
      'name': 'Hamburguesa',
      'type': 'Cena',
      'image': 'assets/meals/hamburgesa.png', // Imagen real de hamburguesa
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: SafeArea(
        child: Column(
          children: [
            // Header con imagen de fondo
            _buildHeader(),

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
                child: Column(
                  children: [
                    const SizedBox(height: 30),

                    // Título
                    Text(
                      'Mis planes alimentarios',
                      style: GoogleFonts.workSans(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),

                    const SizedBox(height: 30),

                    // Selector de días
                    _buildDaySelector(),

                    const SizedBox(height: 30),

                    // Lista de comidas
                    Expanded(child: _buildMealsList()),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      height: 200,
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(20),
          bottomRight: Radius.circular(20),
        ),
        // Imagen de fondo del header
        image: const DecorationImage(
          image: AssetImage('assets/meal_background/meal_background.png'),
          fit: BoxFit.cover,
        ),
      ),
      child: Stack(
        children: [
          // Overlay oscuro
          Container(
            decoration: BoxDecoration(
              borderRadius: const BorderRadius.only(
                bottomLeft: Radius.circular(20),
                bottomRight: Radius.circular(20),
              ),
              color: Colors.black.withValues(alpha: 0.3),
            ),
          ),

          // Contenido del header
          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Botón de regreso
                GestureDetector(
                  onTap: () => Navigator.pop(context),
                  child: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(
                      Icons.arrow_back_ios,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                ),

                const Spacer(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDaySelector() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: days.map((day) {
          final isSelected = day['day'] == selectedDay;
          return GestureDetector(
            onTap: () {
              setState(() {
                selectedDay = day['day'];
              });
            },
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
              decoration: BoxDecoration(
                color: isSelected
                    ? const Color(0xFFFF6B35)
                    : const Color(0xFFF5F5F5),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                day['label'],
                textAlign: TextAlign.center,
                style: GoogleFonts.workSans(
                  color: isSelected ? Colors.white : Colors.grey[600],
                  fontSize: 14,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildMealsList() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: ListView.builder(
        itemCount: meals.length,
        itemBuilder: (context, index) {
          final meal = meals[index];
          return GestureDetector(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => MealDetailPage(
                    mealName: meal['name'],
                    mealType: meal['type'],
                  ),
                ),
              );
            },
            child: Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFF8F8F8),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  // Imagen de la comida
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.1),
                          blurRadius: 4,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.asset(
                        meal['image'],
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) {
                          // Si la imagen falla, muestra el icono como fallback
                          return Container(
                            decoration: BoxDecoration(
                              color: _getMealColor(meal['type']),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Icon(
                              _getMealIcon(meal['type']),
                              color: Colors.white,
                              size: 30,
                            ),
                          );
                        },
                      ),
                    ),
                  ),

                  const SizedBox(width: 16),

                  // Información de la comida
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          meal['name'],
                          style: GoogleFonts.workSans(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          meal['type'],
                          style: GoogleFonts.workSans(
                            fontSize: 14,
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Icono de flecha
                  Icon(
                    Icons.arrow_forward_ios,
                    color: Colors.grey[400],
                    size: 16,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  IconData _getMealIcon(String mealType) {
    switch (mealType.toLowerCase()) {
      case 'desayuno':
        return Icons.free_breakfast;
      case 'almuerzo':
        return Icons.lunch_dining;
      case 'cena':
        return Icons.dinner_dining;
      default:
        return Icons.restaurant;
    }
  }

  Color _getMealColor(String mealType) {
    switch (mealType.toLowerCase()) {
      case 'desayuno':
        return Colors.orange.shade400;
      case 'almuerzo':
        return Colors.blue.shade400;
      case 'cena':
        return Colors.purple.shade400;
      default:
        return Colors.grey.shade400;
    }
  }
}
