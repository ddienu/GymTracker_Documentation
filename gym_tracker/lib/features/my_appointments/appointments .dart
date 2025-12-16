import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/appoinment_details/presentation/appointment_detail.dart';
import 'package:gym_tracker/features/appoinment_details/presentation/appointment_detail_nutritionist.dart';
import 'package:gym_tracker/features/appoinment_details/presentation/appointment_detail_physio.dart';
import 'package:gym_tracker/features/create_appoinments/appoinments_info.dart';
import 'package:gym_tracker/features/medical_appointments_history/presentation/medical_appointment_history.dart';
import 'package:gym_tracker/features/profile/presentation/edit_avatar.dart';
import 'package:gym_tracker/features/notification/widget/notification_card.dart';

class Appointments extends StatelessWidget {
  final List<Map<String, dynamic>> trainingAppointments = [
    {
      "date": "17/Agosto/2025",
      "title": "Sesión con entrenador personal",
      "subtitle": "Valoración inicial",
      "imagePath": "notifications/notification.webp",
    },
  ];

  final List<Map<String, dynamic>> nutritionAppointments = [
    {
      "date": "25/Diciembre/2025",
      "title": "Cita con nutrición + plan nutricional",
      "subtitle": "Valoración Inicial",
      "imagePath": "notifications/meet.jpg",
    },
  ];

  final List<Map<String, dynamic>> physiotherapyAppointments = [
    {
      "date": "5/Febrero/2026",
      "title": "Cita con fisioterapia",
      "subtitle": "Revisión de lesiones",
      "imagePath": "notifications/fisioimage.png",
    },
  ];

  Appointments({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(backgroundColor: Colors.transparent, elevation: 0),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // 📸 Fondo con avatar
            Container(
              height: 260,
              width: double.infinity,
              decoration: const BoxDecoration(
                image: DecorationImage(
                  image: AssetImage('login/logo_background.png'),
                  fit: BoxFit.cover,
                  opacity: 0.8,
                ),
              ),
              child: Center(
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    const CircleAvatar(
                      radius: 70,
                      backgroundImage: AssetImage("profile/profile_image.png"),
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        width: 30,
                        height: 30,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF97316),
                          borderRadius: BorderRadius.circular(18),
                        ),
                        child: IconButton(
                          padding: EdgeInsets.zero,
                          icon: const Icon(Icons.edit, size: 16),
                          color: Colors.white,
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const EditAvatar(),
                              ),
                            );
                          },
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 12),

            // 👋 Nombre y saludo
            Text(
              "Hola, Sabrina",
              style: GoogleFonts.workSans(
                fontSize: 22,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              "Mis citas",
              style: GoogleFonts.workSans(
                fontSize: 20,
                color: Colors.grey[700],
              ),
            ),

            // 🔹 Botones pequeños en una sola línea
            const SizedBox(height: 15),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _ActionButton(
                  label: "Agendar",
                  color: const Color(0xFFF97316),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => AppointmentsInfo(),
                      ),
                    );
                  },
                ),
                _ActionButton(
                  label: "Historial",
                  color: const Color(0xFFF97316),
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => MedicalAppointmentHistory(),
                      ),
                    );
                    
                  },
                ),
              ],
            ),

            const SizedBox(height: 25),

            // 🏋️‍♂️ Entrenamiento
            // 🏋️ Entrenamiento
            _SectionTitle(title: "Entrenamiento"),
            ...trainingAppointments.map(
              (item) => NotificationCard(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) =>
                          const AppointmentDetail(), // ✅ tu vista destino
                    ),
                  );
                },
                date: item['date'],
                title: item['title'],
                subtitle: item['subtitle'],
                imagePath: item['imagePath'],
                fontColor: Colors.white,
              ),
            ),

            const SizedBox(height: 8),

            // 🥗 Nutrición
            _SectionTitle(title: "Nutrición"),
            ...nutritionAppointments.map(
              (item) => NotificationCard(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) =>
                          const AppointmentDetailNutritionist(),
                    ),
                  );
                },
                date: item['date'],
                title: item['title'],
                subtitle: item['subtitle'],
                imagePath: item['imagePath'],
                fontColor: Colors.white,
              ),
            ),

            //Fisioterapia
            const SizedBox(height: 8),
            _SectionTitle(title: "Fisioterapia"),
            ...physiotherapyAppointments.map(
              (item) => NotificationCard(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) =>
                          const AppointmentDetailPhysiotherapy(),
                    ),
                  );
                },
                date: item['date'],
                title: item['title'],
                subtitle: item['subtitle'],
                imagePath: item['imagePath'],
                fontColor: Colors.white,
              ),
            ),

            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

// 🔹 BOTÓN PERSONALIZADO
class _ActionButton extends StatelessWidget {
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ActionButton({
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: MediaQuery.of(context).size.width * 0.35,
        padding: const EdgeInsets.symmetric(vertical: 12),
        margin: const EdgeInsets.symmetric(horizontal: 8),
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(15),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.15),
              blurRadius: 5,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Center(
          child: Text(
            label,
            style: GoogleFonts.workSans(
              color: Colors.white,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}

// 🔹 TÍTULOS DE SECCIÓN
class _SectionTitle extends StatelessWidget {
  final String title;

  const _SectionTitle({required this.title});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 8),
      child: Align(
        alignment: Alignment.centerLeft,
        child: Text(
          title,
          style: GoogleFonts.workSans(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
      ),
    );
  }
}


