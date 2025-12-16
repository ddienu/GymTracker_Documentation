import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/theme/custom_theme.dart';

class MedicalAppointmentHistory extends StatefulWidget {
  const MedicalAppointmentHistory({super.key});

  @override
  State<MedicalAppointmentHistory> createState() =>
      _MedicalAppointmentHistoryState();
}

class _MedicalAppointmentHistoryState
    extends State<MedicalAppointmentHistory> {

  // MOCK DATA (temporal mientras llega el API)
  final List<Map<String, String>> mockAppointments = [
    {
      "professional": "Ana Torres",
      "date": "04/07/2024",
      "specialty": "Nutricionista",
      "status": "Completed",
      "image": "assets/doctor1.png"
    },
    {
      "professional": "Luis Pérez",
      "date": "20/08/2023",
      "specialty": "Entrenamiento",
      "status": "Cancelled",
      "image": "assets/doctor2.png"
    },
    {
      "professional": "Carlos Ríos",
      "date": "23/08/2025",
      "specialty": "Fisioterapia",
      "status": "Scheduled",
      "image": "assets/doctor3.png"
    },
  ];

  Color getStatusColor(String status) {
    switch (status) {
      case "Completed":
        return Colors.green;
      case "Cancelled":
        return Colors.red;
      case "Scheduled":
        return Colors.orange;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              height: MediaQuery.of(context).size.height * 0.31,
              width: double.infinity,
              decoration: const BoxDecoration(
                image: DecorationImage(
                  image: AssetImage('login/logo_background.png'),
                  filterQuality: FilterQuality.high,
                  fit: BoxFit.cover,
                  opacity: 0.8,
                ),
              ),
            ),
            SizedBox(height: MediaQuery.of(context).size.height * 0.02),
            Text(
              "Mi historial de\n citas",
              style: GoogleFonts.workSans(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
              textAlign: TextAlign.center,
            ),

            const SizedBox(height: 10),

            // ============== LISTA DE CITAS ===================
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: mockAppointments.length,
              itemBuilder: (context, index) {
                final item = mockAppointments[index];

                return Container(
                  margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.15),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      )
                    ],
                  ),
                  child: Row(
                    children: [
                      // IMAGE
                      CircleAvatar(
                        radius: 28,
                        backgroundImage: AssetImage(item["image"]!),
                      ),
                      const SizedBox(width: 15),

                      // TEXTOS
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // PROFESIONAL (ya no dice Cita 1)
                            Text(
                              item["professional"]!,
                              style: GoogleFonts.workSans(
                                fontSize: 16,
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                              ),
                            ),

                            // FECHA
                            Text(
                              item["date"]!,
                              style: GoogleFonts.workSans(
                                fontSize: 15,
                                color: Colors.white,
                              ),
                            ),

                            // ESPECIALIDAD
                            Text(
                              item["specialty"]!,
                              style: GoogleFonts.workSans(
                                fontSize: 14,
                                color: Colors.grey[400],
                              ),
                            ),

                            // ESTADO (CON COLOR)
                            Text(
                              item["status"]!,
                              style: GoogleFonts.workSans(
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                                color: getStatusColor(item["status"]!),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // ARROW
                      const Icon(
                        Icons.arrow_forward_ios,
                        color: Colors.white,
                        size: 18,
                      ),
                    ],
                  ),
                );
              },
            ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}
