import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/confirmation/presentation/NutritionConfirmation.dart';
import 'package:gym_tracker/features/confirmation/presentation/PhysioterapyConfirmation.dart';
import '../widget/custom_header.dart';
import '../../confirmation/presentation/confirmation.dart';

class ScheduleTime extends StatefulWidget {
  final DateTime date;
  final String professional;
  final String type;

  const ScheduleTime({
    super.key,
    required this.date,
    required this.professional,
    required this.type,
  });

  @override
  State<ScheduleTime> createState() => _ScheduleTimeState();
}

class _ScheduleTimeState extends State<ScheduleTime> {
  // 🔹 Aquí puedes luego traer los horarios disponibles desde una API
  final List<String> availableHours = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ];

  String? selectedHour;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true, // el AppBar se superpone sobre la imagen
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.white),
      ),

      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 🔹 Encabezado visual reutilizable
          CustomHeader(
            title: "Selecciona la hora",
            backgroundImage: widget.type == 'Nutrición'
                ? 'login/logo_background.png'
                : 'progress/fitness_background.png',
            height: 0.32,
            textColor: Colors.black,
          ),

          // 🔹 Información de la fecha y profesional
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Profesional: ${widget.professional}",
                  style: GoogleFonts.workSans(
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  "Fecha seleccionada: "
                  "${widget.date.day}/${widget.date.month}/${widget.date.year}",
                  style: GoogleFonts.workSans(
                    fontSize: 16,
                    color: Colors.grey[700],
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  "Horarios disponibles",
                  style: GoogleFonts.workSans(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.black87,
                  ),
                ),
              ],
            ),
          ),

          // 🔹 Iteración dinámica: muestra todas las horas disponibles
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              itemCount: availableHours.length,
              itemBuilder: (context, index) {
                final hour = availableHours[index];
                final isSelected = selectedHour == hour;

                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: ElevatedButton(
                    onPressed: () {
                      setState(() => selectedHour = hour);
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor:
                          isSelected ? const Color(0xFFFF7043) : Colors.grey[200],
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                    child: Text(
                      hour,
                      style: GoogleFonts.workSans(
                        color: isSelected ? Colors.white : Colors.black87,
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          // 🔹 Botón confirmar al final
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: ElevatedButton(
              onPressed: selectedHour == null
                  ? null
                  : widget.type == 'Nutricionista'
                      ? () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => Nutritionconfirmation(isCanceled: false, appointmentDate: widget.date, appointmentHour: selectedHour),)
                          );
                        }
                      : widget.type == 'Fisioterapia'
                        ? () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => PhysioterapyConfirmation(isCanceled: false, appointmentDate: widget.date, appointmentHour: selectedHour))
                            );
                          }
                        :   () {
                      // aquí podrías navegar a una pantalla de confirmación
                     Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => Confirmation(isCanceled: false, appointmentDate: widget.date, appointmentHour: selectedHour))
                     );
                    },
                    
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFF7043),
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Text(
                'Confirmar hora',
                style: GoogleFonts.workSans(
                  fontSize: 16,
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
