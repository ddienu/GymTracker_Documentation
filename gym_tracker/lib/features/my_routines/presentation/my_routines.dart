import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

class MyRoutine extends StatefulWidget {
  const MyRoutine({super.key});

  @override
  State<MyRoutine> createState() => _MyRoutineState();
}

class _MyRoutineState extends State<MyRoutine> {
  // ======= VARIABLES PARA SELECTOR INFINITO =======
  int centerIndex = 10000;
  int selectedIndex = 10000;

  DateTime today = DateTime.now();
  DateTime selectedDate = DateTime.now();

  // ======= RUTINAS (DINÁMICAS DESDE API) =======
  List<Map<String, dynamic>> routines = [];

  @override
  void initState() {
    super.initState();
    _fetchRoutinesForDay(today); // cargar rutinas iniciales
  }

  // =========================================================
  // 🔥 ALERTA SI NO HAY RUTINAS
  void _showNoRoutinesDialog() {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (context) {
        return AlertDialog(
          backgroundColor: Colors.white,
          content: Row(
            children: [
              const Icon(
                Icons.info_outline,
                color: Color(0xFFFF6B00),
                size: 28,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Text(
                  "No tienes rutinas asignadas para esta fecha.",
                  style: TextStyle(
                    color: Colors.black87,
                    fontWeight: FontWeight.w500,
                    fontFamily: GoogleFonts.workSans().fontFamily,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // =========================================================
  // 🔥 LLAMAR API PARA TRAER RUTINAS POR FECHA
  Future<void> _fetchRoutinesForDay(DateTime date) async {
    final formatted = DateFormat("yyyy-MM-dd").format(date);

    print("Buscando rutinas para: $formatted");

    // TODO: Conecta tu API aquí
    // Simulación temporal:
    List<Map<String, dynamic>> apiResponse = [];

    // EJEMPLO:
    // if (formatted == "2025-07-30") {
    //   apiResponse = [
    //     {
    //       'name': 'Fuerza central',
    //       'exercises': 5,
    //       'image': 'assets/my_routines/ejercicio.webp',
    //     },
    //   ];
    // }

    setState(() {
      routines = apiResponse;
    });

    if (routines.isEmpty) {
      _showNoRoutinesDialog();
    }
  }

  // =========================================================

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),

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

                    Text(
                      'Mis rutinas',
                      style: GoogleFonts.workSans(
                        fontSize: 26,
                        fontWeight: FontWeight.bold,
                        color: Colors.black,
                      ),
                    ),

                    const SizedBox(height: 30),

                    _buildDaySelector(),

                    const SizedBox(height: 30),

                    Expanded(child: _buildRoutineList()),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ===== HEADER =====
  Widget _buildHeader() {
    return Container(
      height: 200,
      width: double.infinity,
      decoration: const BoxDecoration(
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(20),
          bottomRight: Radius.circular(20),
        ),
        image: DecorationImage(
          image: AssetImage('progress/fitness_background.png'),
          fit: BoxFit.cover,
        ),
      ),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.black.withOpacity(0.3),
          borderRadius: const BorderRadius.only(
            bottomLeft: Radius.circular(20),
            bottomRight: Radius.circular(20),
          ),
        ),
        padding: const EdgeInsets.all(20),
        child: Align(
          alignment: Alignment.topLeft,
          child: GestureDetector(
            onTap: () => Navigator.pop(context),
            child: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(Icons.arrow_back_ios, color: Colors.white),
            ),
          ),
        ),
      ),
    );
  }

  // ===== SELECTOR DE DÍAS =====
  Widget _buildDaySelector() {
    return SizedBox(
      height: 70,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: 20000,
        itemBuilder: (context, index) {
          final date = _dateFromIndex(index);

          final label =
              "${_monthName(date.month)}\n${date.day.toString().padLeft(2, '0')}";

          final isSelected = index == selectedIndex;

          return GestureDetector(
            onTap: () {
              setState(() {
                selectedIndex = index;
                selectedDate = date;
              });

              _fetchRoutinesForDay(selectedDate);
            },
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 8),
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
              decoration: BoxDecoration(
                color: isSelected ? const Color(0xFFFF6B35) : const Color(0xFFF5F5F5),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                label,
                textAlign: TextAlign.center,
                style: GoogleFonts.workSans(
                  color: isSelected ? Colors.white : Colors.grey[600],
                  fontSize: 14,
                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  // ===== LISTA DE RUTINAS DINÁMICA =====
  Widget _buildRoutineList() {
    if (routines.isEmpty) {
      return Center(
        child: Text(
          "No hay rutinas para esta fecha",
          style: GoogleFonts.workSans(
            fontSize: 16,
            color: Colors.grey[600],
          ),
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: ListView.builder(
        itemCount: routines.length,
        itemBuilder: (context, index) {
          final routine = routines[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 16),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFF8F8F8),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.asset(
                    routine['image'],
                    width: 60,
                    height: 60,
                    fit: BoxFit.cover,
                  ),
                ),

                const SizedBox(width: 16),

                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        routine['name'],
                        style: GoogleFonts.workSans(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        "${routine['exercises']} ejercicios",
                        style: GoogleFonts.workSans(
                          fontSize: 14,
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ),
                ),

                Icon(Icons.arrow_forward_ios, color: Colors.grey[400]),
              ],
            ),
          );
        },
      ),
    );
  }

  // ===== FECHAS =====
  DateTime _dateFromIndex(int index) {
    int diff = index - centerIndex;
    return today.add(Duration(days: diff));
  }

  String _monthName(int month) {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May",
      "Jun", "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec"
    ];
    return months[month - 1];
  }
}
