import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class MealDetailPage extends StatelessWidget {
  final String mealName;
  final String mealType;

  const MealDetailPage({
    super.key,
    required this.mealName,
    required this.mealType,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: SafeArea(
        child: Column(
          children: [
            // Header con imagen de fondo
            Container(
              height: 280,
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
                  // Overlay semitransparente para mejorar legibilidad
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

                        const SizedBox(height: 15),

                        // Título centrado
                        Center(
                          child: Text(
                            mealName,
                            style: GoogleFonts.workSans(
                              fontSize: 26,
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                            ),
                          ),
                        ),

                        const SizedBox(height: 15),

                        // Imagen de la comida
                        Expanded(
                          child: Center(
                            child: Container(
                              width: 200,
                              height: 150,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.2),
                                    blurRadius: 10,
                                    offset: const Offset(0, 5),
                                  ),
                                ],
                              ),
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(16),
                                child: _buildMealImage(),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Contenido
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
                      // Ingredientes
                      _buildIngredientsList(),

                      const SizedBox(height: 20),

                      // Información nutricional
                      _buildNutritionalInfo(),
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

  Widget _buildIngredientsList() {
    final mealData = _getMealData();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Ingredientes principales
        ...mealData['ingredients']
            .map<Widget>(
              (ingredient) =>
                  _buildIngredientRow(ingredient['icon'], ingredient['name']),
            )
            .toList(),

        const SizedBox(height: 16),

        // Detalles específicos (vegetales, extras, etc.)
        if (mealData['details'] != null) ...[
          ...mealData['details']
              .map<Widget>((detail) => _buildSubItem(detail))
              .toList(),
          const SizedBox(height: 12),
        ],

        // Toppings/Extras
        if (mealData['toppings'] != null) ...[
          _buildIngredientRow(
            mealData['toppings']['icon'],
            mealData['toppings']['title'],
          ),
          const SizedBox(height: 8),
          ...mealData['toppings']['items']
              .map<Widget>((topping) => _buildSubItem(topping))
              .toList(),
        ],
      ],
    );
  }

  Widget _buildIngredientRow(String icon, String name) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Text(icon, style: GoogleFonts.workSans(fontSize: 18)),
          const SizedBox(width: 12),
          Text(
            name,
            style: GoogleFonts.workSans(
              fontSize: 16,
              fontWeight: FontWeight.w500,
              color: Colors.black,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubItem(String name) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4, left: 30),
      child: Text(
        name,
        style: GoogleFonts.workSans(fontSize: 14, color: Colors.grey.shade600),
      ),
    );
  }

  Widget _buildNutritionalInfo() {
    final nutritionData = _getNutritionalData();

    return Column(
      children: nutritionData
          .map<Widget>(
            (nutrient) => _buildNutrientBar(
              nutrient['icon'],
              nutrient['name'],
              nutrient['value'],
              nutrient['color'],
              nutrient['progress'],
            ),
          )
          .toList(),
    );
  }

  Widget _buildNutrientBar(
    String icon,
    String name,
    String value,
    Color color,
    double progress,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 15),
      child: Column(
        children: [
          Row(
            children: [
              Text(icon, style: GoogleFonts.workSans(fontSize: 20)),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  name,
                  style: GoogleFonts.workSans(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Colors.black,
                  ),
                ),
              ),
              Text(
                value,
                style: GoogleFonts.workSans(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey.shade600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: progress,
            backgroundColor: Colors.grey.shade200,
            valueColor: AlwaysStoppedAnimation<Color>(color),
            minHeight: 6,
          ),
        ],
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

  Map<String, dynamic> _getMealData() {
    switch (mealName.toLowerCase()) {
      case 'changua':
        return {
          'ingredients': [
            {'icon': '🥛', 'name': 'Leche fresca'},
            {'icon': '🧄', 'name': 'Ajo'},
            {'icon': '🧅', 'name': 'Cebolla larga'},
            {'icon': '🥚', 'name': 'Huevo'},
            {'icon': '🍞', 'name': 'Pan tostado'},
          ],
          'details': ['Cilantro fresco', 'Sal al gusto', 'Pimienta negra'],
          'toppings': {
            'icon': '🧂',
            'title': 'Condimentos',
            'items': ['Queso campesino', 'Mantequilla', 'Cilantro picado'],
          },
        };

      case 'hamburguesa':
        return {
          'ingredients': [
            {'icon': '🥩', 'name': 'Carne de res'},
            {'icon': '🍞', 'name': 'Pan de hamburguesa'},
            {'icon': '🧀', 'name': 'Queso cheddar'},
            {'icon': '🥬', 'name': 'Lechuga'},
            {'icon': '🍅', 'name': 'Tomate'},
          ],
          'details': ['Cebolla caramelizada', 'Pepinillos', 'Papas fritas'],
          'toppings': {
            'icon': '🍯',
            'title': 'Salsas',
            'items': ['Salsa de tomate', 'Mayonesa', 'Mostaza', 'Salsa BBQ'],
          },
        };

      case 'ramen':
      default:
        return {
          'ingredients': [
            {'icon': '🍜', 'name': 'Fideos Konjac'},
            {'icon': '🥄', 'name': 'Caldo de verduras'},
            {'icon': '🐟', 'name': 'Proteína salmón'},
            {'icon': '🥬', 'name': 'Vegetales'},
          ],
          'details': ['Espinaca', 'Zanahoria', 'Champiñón', 'Pak choi'],
          'toppings': {
            'icon': '🧂',
            'title': 'Toppings',
            'items': [
              'Cebollino',
              'Sésamo',
              'Alga nori',
              'Salsa baja en sodio',
            ],
          },
        };
    }
  }

  List<Map<String, dynamic>> _getNutritionalData() {
    switch (mealName.toLowerCase()) {
      case 'changua':
        return [
          {
            'icon': '🌱',
            'name': 'Protein',
            'value': '15g',
            'color': Colors.green,
            'progress': 0.6,
          },
          {
            'icon': '🌾',
            'name': 'Carbs',
            'value': '12g',
            'color': Colors.orange,
            'progress': 0.9,
          },
          {
            'icon': '🫐',
            'name': 'Fat',
            'value': '8g',
            'color': Colors.purple,
            'progress': 0.3,
          },
        ];

      case 'hamburguesa':
        return [
          {
            'icon': '🌱',
            'name': 'Protein',
            'value': '28g',
            'color': Colors.green,
            'progress': 0.9,
          },
          {
            'icon': '🌾',
            'name': 'Carbs',
            'value': '35g',
            'color': Colors.orange,
            'progress': 0.7,
          },
          {
            'icon': '🫐',
            'name': 'Fat',
            'value': '25g',
            'color': Colors.purple,
            'progress': 0.8,
          },
        ];

      case 'ramen':
      default:
        return [
          {
            'icon': '🌱',
            'name': 'Protein',
            'value': '22g',
            'color': Colors.green,
            'progress': 0.8,
          },
          {
            'icon': '🌾',
            'name': 'Carbs',
            'value': '1.8g',
            'color': Colors.orange,
            'progress': 0.5,
          },
          {
            'icon': '🫐',
            'name': 'Fat',
            'value': '19g',
            'color': Colors.purple,
            'progress': 0.6,
          },
        ];
    }
  }

  Widget _buildMealImage() {
    String imagePath = _getMealImagePath();

    return Image.asset(
      imagePath,
      fit: BoxFit.cover,
      width: 200,
      height: 150,
      errorBuilder: (context, error, stackTrace) {
        // Si la imagen falla, muestra el placeholder con icono
        return Container(
          width: 200,
          height: 150,
          decoration: BoxDecoration(
            color: _getMealColor(mealType),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Icon(_getMealIcon(mealType), color: Colors.white, size: 50),
        );
      },
    );
  }

  String _getMealImagePath() {
    switch (mealName.toLowerCase()) {
      case 'changua':
        return 'assets/meals/changua.png';
      case 'hamburguesa':
        return 'assets/meals/hamburgesa.png'; // Nota: el archivo tiene esta ortografía
      case 'ramen':
        return 'assets/meals/ramen.png';
      default:
        return 'assets/meals/ramen.png'; // Imagen por defecto
    }
  }
}
