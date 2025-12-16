import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:gym_tracker/features/begin/widgets/custombutton.dart';
import 'package:gym_tracker/features/home/presentation/homepage.dart'as home_page;

class Nutritionconfirmation extends StatefulWidget {
  final bool isCanceled; // true = cancelada, false = agendada
  final DateTime? appointmentDate; // fecha dinámica
  final String? appointmentHour;

  const Nutritionconfirmation({
    super.key,
    this.isCanceled = false,
    this.appointmentDate,
    this.appointmentHour

  });

  @override
  State<Nutritionconfirmation> createState() => _ConfirmationState();
}

// 👇 Renombré la clase interna a _ConfirmationState (mejor práctica)
class _ConfirmationState extends State<Nutritionconfirmation> {
  String _buildMessage() {
    if (widget.isCanceled) {
      return "Tu cita fue cancelada exitosamente.";
    } else if (widget.appointmentDate != null) {
      final formattedDate = DateFormat(
        "d 'de' MMMM 'de' y",
        'es_ES',
      ).format(widget.appointmentDate!);
      return "Tu cita ha sido confirmada para el $formattedDate a las ${widget.appointmentHour}";
    } else {
      return "Tu cita ha sido confirmada.";
    }
  }

  @override
  Widget build(BuildContext context) {
    final String message = _buildMessage();

    return Theme(
      data: Theme.of(context).copyWith(
        textTheme: GoogleFonts.workSansTextTheme(
          Theme.of(context).textTheme,
        ),
      ),
      child: Scaffold(
        body: Stack(
          fit: StackFit.expand,
          children: [
            // Fondo con imagen
            Image.asset(
              'assets/confirmation/confirmation_two.png',
              fit: BoxFit.cover,
            ),

            // 🔹 Degradado en la parte inferior
            Positioned.fill(
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.center,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withOpacity(0.9),
                    ],
                  ),
                ),
              ),
            ),

            // 🔹 Icono centrado
            Positioned(
              bottom: 250,
              left: 0,
              right: 0,
              child: Center(
                child: Container(
                  width: 80,
                  height: 80,
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: widget.isCanceled
                        ? Colors.green[100]
                        : Colors.green[100],
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    widget.isCanceled ? Icons.check : Icons.check,
                    color: widget.isCanceled ? Colors.green: Colors.green,
                    size: 40,
                  ),
                ),
              ),
            ),

            // 🔹 Mensaje
            Positioned(
              bottom: 150,
              left: 20,
              right: 24,
              child: Text(
                message,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 18,
                  color: Colors.white,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),

            // 🔹 Botón inferior
            Positioned(
              bottom: 50,
              left: 0,
              right: 0,
              child: Center(
                child: CustomButton(
                  text: "Volver a pantalla principal",
                  onPressed: () {
                    showDialog(
                      context: context,
                      barrierDismissible: false,
                      builder: (context) {
                        Future.delayed(const Duration(seconds: 3), () {
                          Navigator.pop(context); // cierra el diálogo
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  const home_page.HomePage(), // ✅ tu HomePage real
                            ),
                          );
                        });

                        return AlertDialog(
                          backgroundColor: Colors.white,
                          content: Row(
                            children: [
                              const CircularProgressIndicator(
                                valueColor:
                                    AlwaysStoppedAnimation(Color(0xFFFF6B00)),
                              ),
                              const SizedBox(width: 16),
                              Text(
                                "Regresando a mi cuenta...",
                                style: TextStyle(
                                  color: Colors.black87,
                                  fontWeight: FontWeight.w500,
                                  fontFamily:
                                      GoogleFonts.workSans().fontFamily,
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
              ),
            ),
          ],
        ),
      ),
    );
  }
}
