import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/begin/widgets/custombutton.dart';
import 'package:gym_tracker/features/home/presentation/homepage.dart';
import 'package:gym_tracker/features/register/widgets/appbar_custom.dart';
import 'package:gym_tracker/features/register/widgets/height_picker.dart';

class RegistrationHeight extends StatelessWidget {
  const RegistrationHeight({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF97316),
      appBar: AppBar(
        backgroundColor: Color(0xFFF97316),
        surfaceTintColor: Colors.transparent,
        title: AppBarCustom(label: "Registro", pageCounter: "7"),
      ),
      body: Column(
        children: [
          SizedBox(height: MediaQuery.of(context).size.height * 0.04),
          SizedBox(
            width: double.infinity,
            child: Text(
              "¿Cual es tu estatura?",
              style: GoogleFonts.workSans(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          Expanded(child: HeightNumberPicker()),
          CustomButton(
            text: "Continuar",
            onPressed: () {
              showDialog(
                context: context, 
                builder: (context) => AlertDialog(
                  title: Text("Éxito"),
                  content: Text("Cuenta creada exitosamente"),
                  actions: [
                    CustomButton(
                      text: "OK", 
                      onPressed: (){
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => HomePage()
                            )
                        );
                      }, 
                      width: 0.5, 
                      icon: Icons.check, 
                      color: Colors.black
                      )
                  ],
                )
                );
            },
            width: 0.8,
            icon: Icons.arrow_forward,
            color: Colors.black,
          ),
          SizedBox(height: MediaQuery.of(context).size.height * 0.06),
        ],
      ),
    );
  }
}
