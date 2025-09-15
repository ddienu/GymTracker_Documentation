import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/begin/widgets/custombutton.dart';
import 'package:gym_tracker/features/register/presentation/registration_physical_status.dart';
import 'package:gym_tracker/features/register/widgets/appbar_custom.dart';
import 'package:gym_tracker/features/register/widgets/weight_picker.dart';

class RegistrationWeigth extends StatelessWidget{
    const RegistrationWeigth({super.key});
    
      @override
      Widget build(BuildContext context) {
       return Scaffold(
        backgroundColor: Color(0xFFF97316),
        appBar: AppBar(
          backgroundColor: Color(0xFFF97316),
          surfaceTintColor: Colors.transparent,
          title: AppBarCustom(
            label: "Registro",
             pageCounter: "3"
             ),
        ),
        body: Column(
          children: [
            SizedBox(height: MediaQuery.of(context).size.height * 0.05),
            SizedBox(
              width: double.infinity,
              child: Container(
                padding: EdgeInsets.all(12),
                child: Text(
                  "¿Cuál es tu peso actual?",
                  style: GoogleFonts.workSans(
                    fontSize: 32,
                    fontWeight: FontWeight.bold
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
            SizedBox(
              height: MediaQuery.of(context).size.height * 0.6,
              child: WeightNumberPicker(),
            ),
            CustomButton(
              text: "Continuar", 
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const RegistrationPhysicalStatus()
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