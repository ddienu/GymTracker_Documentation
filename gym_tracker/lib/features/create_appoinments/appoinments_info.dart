import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/begin/widgets/custombutton.dart';
import 'package:gym_tracker/features/schedule_appointment/presentation/schedule_calendar.dart';

class AppointmentsInfo extends StatefulWidget {
  const AppointmentsInfo({super.key});

  @override
  State<AppointmentsInfo> createState() => _AppointmentsInfoState();
}

class _AppointmentsInfoState extends State<AppointmentsInfo> {
  int? selectedIndex; // <-- el estado de selección

  final List<String> appointmentOptions = [
    "1 Cita con entrenador",
    "2 Citas con nutrición",
    "1 Cita con fisioterapia",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      body: Stack(
        fit: StackFit.expand,
        children: [
          Image.asset(
            'appointment_info/gym.webp',
            fit: BoxFit.cover,
          ),

          // Oscurecer
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withOpacity(0.8),
                  ],
                ),
              ),
            ),
          ),

          SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "Tus citas",
                    style: GoogleFonts.workSans(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),

                  const SizedBox(height: 12),

                  Text(
                    "En el momento tienes disponibles:",
                    style: GoogleFonts.workSans(
                      fontSize: 17,
                      color: Colors.white70,
                    ),
                    textAlign: TextAlign.center,
                  ),

                  const SizedBox(height: 350),

                  // LISTA DINÁMICA
                  ...List.generate(appointmentOptions.length, (index) {
                    return Column(
                      children: [
                        _AppointmentButton(
                          text: appointmentOptions[index],
                          selected: selectedIndex == index,
                          onPressed: () {
                            setState(() {
                              selectedIndex = index;
                            });
                          },
                        ),
                        const SizedBox(height: 20),
                      ],
                    );
                  }),

                  const SizedBox(height: 70),

                  // BOTÓN CONTINUAR
                  CustomButton(
                    text: "Agendar cita",
                    icon: Icons.arrow_forward,
                    color: const Color(0xFFF97316),
                    width: 0.9,
                    onPressed: () {
                      if (selectedIndex == null) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text("Selecciona una cita para continuar"),
                          ),
                        );
                        return;
                      }

                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              ScheduleCalendar(type: appointmentOptions[selectedIndex!]),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _AppointmentButton extends StatelessWidget {
  final String text;
  final bool selected;
  final VoidCallback onPressed;

  const _AppointmentButton({
    required this.text,
    required this.selected,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: OutlinedButton(
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          padding: const EdgeInsets.symmetric(vertical: 16),
          side: BorderSide(
            color: selected ? Colors.orange : Colors.white,
            width: selected ? 2.5 : 1.5,
          ),
          backgroundColor:
              selected ? Colors.orange.withOpacity(0.25) : Colors.white.withOpacity(0.14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
        ),
        child: Text(
          text,
          style: GoogleFonts.workSans(
            fontSize: 16,
            color: selected ? Colors.orange : Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}
