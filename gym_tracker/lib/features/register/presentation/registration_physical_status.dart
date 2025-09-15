import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/begin/widgets/custombutton.dart';
import 'package:gym_tracker/features/register/presentation/registration_gender.dart';
import 'package:gym_tracker/features/register/widgets/appbar_custom.dart';
import 'package:gym_tracker/features/register/widgets/custom_dial.dart';

class RegistrationPhysicalStatus extends StatelessWidget {
  const RegistrationPhysicalStatus({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: AppBarCustom(label: "Registro", pageCounter: "4"),
      ),
      body: Column(
        children: [
          SizedBox(height: MediaQuery.of(context).size.height * 0.04),
          SizedBox(
            width: double.infinity,
            child: Container(
              padding: EdgeInsets.all(12),
              child: Column(
                children: [
                  Text(
                    "¿Cómo evaluarías tu estado físico?",
                    style: GoogleFonts.workSans(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: MediaQuery.of(context).size.height * 0.1),
          CustomDial(),
          SizedBox(height: MediaQuery.of(context).size.height * 0.1),
          CustomButton(
            text: 'Continuar',
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const RegistrationGender()
                  )
              );
            },
            width: 0.8,
            icon: Icons.arrow_forward,
            color: Colors.black,
          ),
        ],
      ),
    );
  }
}
