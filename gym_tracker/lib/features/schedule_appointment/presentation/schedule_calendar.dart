import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../widget/custom_header.dart';
import 'schedule_time.dart';





class ScheduleCalendar extends StatefulWidget {
  // ⚙️ Los datos ahora son opcionales
  final String? professional;
  final String? type;

  const ScheduleCalendar({super.key, this.professional, this.type});

  @override
  State<ScheduleCalendar> createState() => _ScheduleCalendarState();
}

class _ScheduleCalendarState extends State<ScheduleCalendar> {
  DateTime? selectedDate;
  late String professional;
  late String type;

  @override
  void initState() {
    super.initState();

    // 🔹 Si no llegan datos (porque no hay API aún), usamos ejemplos dinámicos
    professional = widget.professional ?? 'Dra. María López';
    type = widget.type ?? 'Nutrición'; // Cambia según vista que estés probando
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: Column(
        children: [
          // 🔹 Cabecera con fondo dinámico según el tipo
          CustomHeader(
            title: "Agenda tu cita",
            backgroundImage: type == 'Nutrición'
                ? 'progress/nutrition_background.png'
                : 'progress/fitness_background.png',
            height: 0.32,
            
          ),

          const SizedBox(height: 20),

          // 🔹 Texto con información dinámica
          Text(
            "Profesional: $professional",
            style: GoogleFonts.workSans(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.black87,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            "Tipo de cita: $type",
            style: GoogleFonts.workSans(
              fontSize: 16,
              color: Colors.grey[700],
            ),
          ),

          const SizedBox(height: 20),

          // 🔹 Calendario nativo
          CalendarDatePicker(
            initialDate: DateTime.now(),
            firstDate: DateTime.now(),
            lastDate: DateTime.now().add(const Duration(days: 60)),
            onDateChanged: (date) => setState(() => selectedDate = date),
          ),

          const Spacer(),

          // 🔹 Botón confirmar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: ElevatedButton(
              onPressed: selectedDate == null
                  ? null
                  : () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => ScheduleTime(
                            date: selectedDate!,
                            professional: professional,
                            type: type,
                          ),
                        ),
                      );
                    },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFF6B00),
                minimumSize: const Size(double.infinity, 50),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              child: Text(
                'Confirmar fecha',
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
