import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/begin/widgets/custombutton.dart';
import 'package:gym_tracker/features/register/presentation/registration_target.dart';
import 'package:gym_tracker/features/register/widgets/appbar_custom.dart';
import 'package:gym_tracker/features/register/widgets/gender_card.dart';

class RegistrationGender extends StatelessWidget{
  const RegistrationGender({super.key});
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: AppBarCustom(
          label: "Registro", 
          pageCounter: "5"
          ),
      ),
      body: Column(
        children: [
          SizedBox(height: MediaQuery.of(context).size.height * 0.04),
          SizedBox(
            width: double.infinity,
            child: Text(
              "¿Cuál es tu genero?",
              style: GoogleFonts.workSans(
                fontSize: 32,
                fontWeight: FontWeight.bold
              ),
              textAlign: TextAlign.center,
            ),
          ),
          SizedBox(
            height: 500,
            child: GenderCard()
            ),
          CustomButton(
            text: 'Continuar',
            onPressed: () { 
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const RegistrationTarget()
                  )
              );
             },
            width: 0.8,
            icon: Icons.arrow_forward,
            color: Colors.black
            )
        ],
      ),
    );
  }
}