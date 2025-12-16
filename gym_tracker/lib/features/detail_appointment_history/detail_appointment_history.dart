import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/home/presentation/homepage.dart' as home_page;
import 'package:gym_tracker/features/begin/widgets/custombutton.dart';

class DetailAppointmentHistory extends StatefulWidget {
  final bool isCanceled;
  final String message;

  /// 🔥 Aquí recibes el estado REAL desde el API:
  /// "Cancelled" | "Completed" | "Scheduled"
  final String appointmentStatus;

  const DetailAppointmentHistory({
    super.key,
    this.isCanceled = false,
    this.message = "Tu cita ha sido completada",
    this.appointmentStatus = "Completed", // valor por defecto
  });

  @override
  State<DetailAppointmentHistory> createState() => _DetailAppointmentHistoryState();
}

class _DetailAppointmentHistoryState extends State<DetailAppointmentHistory> {

  // 🔥 Convertir estado API → texto español
  String getStatusText(String status) {
    switch (status) {
      case "Cancelled":
        return "Cancelada";
      case "Completed":
        return "Cumplida";
      case "Scheduled":
        return "Agendada";
      default:
        return "Desconocido";
    }
  }

  // 🔥 Convertir estado API → color
  Color getStatusColor(String status) {
    switch (status) {
      case "Cancelled":
        return Colors.red;
      case "Completed":
        return Colors.green;
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
            // 🔹 Imagen superior
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

            const SizedBox(height: 20),

            // 🔹 Título
            Text(
              "Detalle de cita",
              style: GoogleFonts.workSans(
                fontSize: 26,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),

            const SizedBox(height: 25),

            // 🟦 Tarjeta de información
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 18),
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(22),
                boxShadow: [
                  BoxShadow(
                    color: Colors.grey.withOpacity(0.35),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  )
                ],
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const CircleAvatar(
                    radius: 35,
                    backgroundImage: AssetImage("assets/doctor1.png"),
                  ),
                  const SizedBox(width: 12),

                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _detail("Fecha y Hora:", "04/07/2024 - 3:00 PM"),
                        _detail("Especialista:", "Dra. Juana Pérez\n(Nutricionista)"),
                        _detail("Duración de la Cita:", "45 minutos"),

                        // ⭐ ESTADO REAL
                        _detail(
                          "Estado:",
                          getStatusText(widget.appointmentStatus),
                          color: getStatusColor(widget.appointmentStatus),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 260),

            // 🔹 Botón inferior
            CustomButton(
              text: "Volver a pantalla principal",
              onPressed: () {
                showDialog(
                  context: context,
                  barrierDismissible: false,
                  builder: (context) {
                    Future.delayed(const Duration(seconds: 3), () {
                      Navigator.pop(context);
                      Navigator.pushReplacement(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const home_page.HomePage(),
                        ),
                      );
                    });

                    return AlertDialog(
                      backgroundColor: Colors.white,
                      content: Row(
                        children: [
                          const CircularProgressIndicator(
                            valueColor: AlwaysStoppedAnimation(Color(0xFFFF6B00)),
                          ),
                          const SizedBox(width: 16),
                          Text(
                            "Regresando a mi cuenta...",
                            style: TextStyle(
                              color: Colors.black87,
                              fontWeight: FontWeight.w500,
                              fontFamily: GoogleFonts.workSans().fontFamily,
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                );
              },
              width: 0.9,
              icon: Icons.arrow_forward,
              color: Theme.of(context).colorScheme.primary,
            ),

            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  // 🔹 Helper de estilos
  Widget _detail(String title, String value, {Color? color}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8.0),
      child: RichText(
        text: TextSpan(
          children: [
            TextSpan(
              text: "$title ",
              style: GoogleFonts.workSans(
                fontSize: 15,
                fontWeight: FontWeight.bold,
                color: Colors.black,
              ),
            ),
            TextSpan(
              text: value,
              style: GoogleFonts.workSans(
                fontSize: 15,
                color: color ?? Colors.black,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
