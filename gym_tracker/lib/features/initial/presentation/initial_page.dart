import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/begin/presentation/begin.dart';


class InitialPage extends StatelessWidget {
  const InitialPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromRGBO(249, 115, 22, 1),
      body: GestureDetector(
        behavior: HitTestBehavior.translucent, // detecta taps en todo el body
        onTap: () {
          // Cambia de vista al dar clic en cualquier parte
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const Begin()),
          );
        },
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image(
                image: AssetImage('assets/gym_logo.png'),
                filterQuality: FilterQuality.high,
              ),
              SizedBox(height: 20),
              Text(
                "GYM TRACKER",
                style: GoogleFonts.workSans(
                  fontSize: 40,
                  fontWeight: FontWeight.bold,
                  color: Colors.white
                )
              ),
              SizedBox(height: 10),
              Text(
                "Tu fuerza, tu marcador.",
                style: GoogleFonts.workSans(
                  fontSize: 20,
                  fontWeight: FontWeight.w300,
                  color: Colors.white
                )
              ),
            ],
          ),
        ),
      ),
    );
  }
}
