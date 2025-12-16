import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';

class Progress extends StatefulWidget {
  const Progress({super.key});

  @override
  State<Progress> createState() => _ProgressState();
}

class _ProgressState extends State<Progress> {
  String selectedMonth = "Enero";

  double peso = 80.0;
  int edad = 30;

  final Map<String, List<Map<String, dynamic>>> monthData = {
    "Enero": [
      {"label": "Brazo", "value": 50.0, "color": Colors.red},
      {"label": "Pecho", "value": 95.0, "color": Colors.green},
      {"label": "Pierna", "value": 70.0, "color": Colors.orange},
      {"label": "Cintura", "value": 10.0, "color": Colors.purple},
      {"label": "% Grasa", "value": 60.0, "color": Colors.blue},
    ],
    "Febrero": [
      {"label": "Brazo", "value": 45.0, "color": Colors.red},
      {"label": "Pecho", "value": 92.0, "color": Colors.green},
      {"label": "Pierna", "value": 72.0, "color": Colors.orange},
      {"label": "Cintura", "value": 97.0, "color": Colors.purple},
      {"label": "% Grasa", "value": 58.0, "color": Colors.blue},
    ],
    "Marzo": [
      {"label": "Brazo", "value": 10.0, "color": Colors.red},
      {"label": "Pecho", "value": 90.0, "color": Colors.green},
      {"label": "Pierna", "value": 75.0, "color": Colors.orange},
      {"label": "Cintura", "value": 10.0, "color": Colors.purple},
      {"label": "% Grasa", "value": 55.0, "color": Colors.blue},
    ],
  };

  @override
  Widget build(BuildContext context) {
    final currentData = monthData[selectedMonth]!;

    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // 🔹 Fondo + Avatar sobrepuesto (sin modificar estructura)
            Stack(
              alignment: Alignment.center,
              clipBehavior: Clip.none,
              children: [
                // 🔸 Solo redondeamos la imagen superior
                Container(
                  height: MediaQuery.of(context).size.height * 0.31,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    borderRadius: const BorderRadius.only(
                      bottomLeft: Radius.circular(30),
                      bottomRight: Radius.circular(30),
                    ),
                    image: const DecorationImage(
                      image: AssetImage('progress/fitness_background.png'),
                      filterQuality: FilterQuality.high,
                      fit: BoxFit.cover,
                      opacity: 0.9,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.15),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                ),
                // Avatar se mantiene igual
                const Positioned(
                  bottom: -50,
                  child: CircleAvatar(
                    radius: 70,
                    backgroundImage: AssetImage("profile/profile_image.png"),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 60),

            Text(
              'Mi Progreso',
              style: GoogleFonts.workSans(
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 20),

            Text(
              'Selecciona un mes y revisa tu progreso',
              style: GoogleFonts.workSans(
                fontSize: 16,
                color: Colors.grey.shade600,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 20),

            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 100),
              child: DropdownButton<String>(
                value: selectedMonth,
                isExpanded: true,
                items: monthData.keys
                    .map((month) => DropdownMenuItem(
                          value: month,
                          child: Text(
                            month,
                            style: GoogleFonts.workSans(
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ))
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    selectedMonth = value!;
                  });
                },
              ),
            ),

            const SizedBox(height: 20),

            // 🔹 Gráfico dinámico
            SizedBox(
              height: 300,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: BarChart(
                  BarChartData(
                    alignment: BarChartAlignment.spaceAround,
                    groupsSpace: 55,
                    maxY: 110,
                    titlesData: FlTitlesData(
                      leftTitles: AxisTitles(
                        sideTitles: SideTitles(
                          showTitles: true,
                          reservedSize: 40,
                          interval: 20,
                          getTitlesWidget: (value, meta) {
                            return Text(
                              value.toInt().toString(),
                              style: GoogleFonts.workSans(fontSize: 11),
                            );
                          },
                        ),
                      ),
                      bottomTitles: AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                      rightTitles: AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                      topTitles: AxisTitles(
                        sideTitles: SideTitles(showTitles: false),
                      ),
                    ),
                    gridData: FlGridData(show: true, drawVerticalLine: false),
                    borderData: FlBorderData(
                      show: true,
                      border: const Border(
                        left: BorderSide(color: Colors.black, width: 1),
                        bottom: BorderSide(color: Colors.black, width: 1),
                      ),
                    ),
                    barGroups: currentData.asMap().entries.map((entry) {
                      final index = entry.key;
                      final metric = entry.value;
                      return BarChartGroupData(
                        x: index,
                        barRods: [
                          BarChartRodData(
                            toY: metric["value"],
                            color: metric["color"],
                            width: 18,
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ],
                      );
                    }).toList(),
                  ),
                  swapAnimationDuration: const Duration(milliseconds: 300),
                ),
              ),
            ),

            const SizedBox(height: 20),

            // 🔹 Card con métricas debajo del gráfico
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Card(
                elevation: 1,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: currentData.map((metric) {
                      final isGrasa =
                          metric["label"].toString().contains("Grasa");
                      final unit = isGrasa ? "%" : "cm";
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6),
                        child: Row(
                          children: [
                            Container(
                              width: 14,
                              height: 14,
                              decoration: BoxDecoration(
                                color: metric["color"],
                                shape: BoxShape.rectangle,
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                metric["label"],
                                style: GoogleFonts.workSans(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                            Text(
                              "${metric["value"]}$unit",
                              style: GoogleFonts.workSans(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: Colors.grey.shade700,
                              ),
                            ),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 10),

            // 🔹 Cards de Peso y Edad
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              child: LayoutBuilder(
                builder: (context, constraints) {
                  if (constraints.maxWidth > 500) {
                    return Row(
                      children: [
                        Expanded(child: _buildInfoCard("Peso", "$peso kg")),
                        const SizedBox(width: 12),
                        Expanded(child: _buildInfoCard("Edad", "$edad años")),
                      ],
                    );
                  } else {
                    return Column(
                      children: [
                        _buildInfoCard("Peso", "$peso kg"),
                        const SizedBox(height: 12),
                        _buildInfoCard("Edad", "$edad años"),
                      ],
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard(String title, String value) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Padding(
        padding:  EdgeInsets.all(12),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(title,
                style: GoogleFonts.workSans(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey.shade600,
                )),
            Text(value,
                style: GoogleFonts.workSans(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                )),
          ],
        ),
      ),
    );
  }
}
