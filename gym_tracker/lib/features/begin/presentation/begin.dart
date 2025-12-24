// Esta sería tu vista de menú
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/begin/widgets/custombutton.dart';
import 'package:gym_tracker/features/login/presentation/login.dart';
import 'package:gym_tracker/features/register/presentation/registration_email_password.dart';
import 'package:gym_tracker/services/auth_service.dart';

class Begin extends StatelessWidget {
  final AuthService authService = AuthService();
  Begin({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
            image: DecorationImage(
                image: AssetImage('begin_background.png'),
                filterQuality: FilterQuality.high,
                fit: BoxFit.cover)),
        child: Center(
            child: Column(
  mainAxisAlignment: MainAxisAlignment.center,
  children: [
    const Spacer(flex: 2), // espacio flexible arriba
    Image.asset(
      'assets/gym_logo.png',
      width: 150,
      height: 150,
      fit: BoxFit.cover,
    ),
    Text(
      "Bienvenido a Gym Tracker",
      style: GoogleFonts.workSans(
        fontWeight: FontWeight.bold,
        fontSize: 42,
        color: Colors.white,
      ),
      textAlign: TextAlign.center,
    ),
    const SizedBox(height: 10),
    Text(
      "Seguimiento a la mano",
      style: GoogleFonts.workSans(
        fontSize: 18,
        color: Colors.white,
        fontWeight: FontWeight.w500,
      ),
    ),
    const SizedBox(height: 20),
    CustomButton(
      text: "Inicia",
      onPressed: () => Navigator.push(
        context, 
        MaterialPageRoute(builder: (context) => Login(authService: authService)),
        ), 
        width: 0.4, 
        icon: Icons.arrow_forward, 
        color: Color(0xFFF97316)
    ),
    const SizedBox(height: 30),
    RichText(
      text: TextSpan(
        style: const TextStyle(
          fontSize: 16,
          color: Colors.white,
          fontFamily: 'WorkSans',
        ),
        children: [
          const TextSpan(text: "¿No tienes cuenta? Regístrate "),
          TextSpan(
            text: "aquí",
            style: const TextStyle(
              color: Colors.blue,
              fontWeight: FontWeight.bold,
              decoration: TextDecoration.underline,
            ),
            recognizer: TapGestureRecognizer()
              ..onTap = () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => RegistrationEmailPassword()
                  )
                )
          ),
        ],
      ),
    ),
    const SizedBox(height: 30),
  ],
)

        ),
      ),
    );
  }
}
