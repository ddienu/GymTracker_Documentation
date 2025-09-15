import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/begin/widgets/custombutton.dart';
import 'package:gym_tracker/features/register/presentation/registration_weigth.dart';
import 'package:gym_tracker/features/register/widgets/age_picker.dart';
import 'package:gym_tracker/features/register/widgets/appbar_custom.dart';

class RegistrationAge extends StatelessWidget{
  const RegistrationAge({super.key});
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        surfaceTintColor: Colors.transparent,
        backgroundColor: Colors.white,
        title: AppBarCustom(
          label: "Registro", 
          pageCounter: "2"
          ),
      ),
      body: Column(
        children: [
          SizedBox(height: MediaQuery.of(context).size.height * 0.03),
          Text("¿Cuál es tu edad?",
          style: GoogleFonts.workSans(
            fontSize: 32,
            fontWeight: FontWeight.bold 
          ),),
          AgePicker(),
          CustomButton(
            text: "Continuar", 
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const RegistrationWeigth()
                  )
              );  
            }, 
            width: 0.8, 
            icon: Icons.arrow_forward, 
            color: Colors.black
            )
        ],
      )
    );
  }
  
}