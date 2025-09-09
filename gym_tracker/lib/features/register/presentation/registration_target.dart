import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/begin/widgets/custombutton.dart';
import 'package:gym_tracker/features/register/presentation/registration_height.dart';
import 'package:gym_tracker/features/register/widgets/appbar_custom.dart';
import 'package:gym_tracker/features/register/widgets/selectable_card_target.dart';

class RegistrationTarget extends StatefulWidget {
  const RegistrationTarget({super.key});

  @override
  State<RegistrationTarget> createState() => _RegistrationTargetState();
}

class _RegistrationTargetState extends State<RegistrationTarget> {
  int indexSelected = -1;

  final List<Map<String, dynamic>> targetOptions = [                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
    {"label": "Perder peso", "icon": Icons.monitor_weight},
    {"label": "Entrenamiento personalizado", "icon": Icons.personal_injury},
    {"label": "Ganar masa muscular", "icon": Icons.fitness_center},
    {"label": "Aumentar resistencia", "icon": Icons.directions_run},
    {"label": "Bienestar general", "icon": Icons.health_and_safety},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: AppBarCustom(label: "Registro", pageCounter: "6"),
      ),
      body: Column(
        children: [
          SizedBox(height: MediaQuery.of(context).size.height * 0.03),
          Text(
            "¿Qué quieres lograr con tu entrenamiento?",
            style: GoogleFonts.workSans(
              fontSize: 28,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: MediaQuery.of(context).size.height * 0.03),
          Column(
            children: [
              ...targetOptions.asMap().entries.map((entry) {
                final index = entry.key;
                final target = entry.value;

                return SelectableCardTarget(
                  label: target['label'],
                  icon: target['icon'],
                  isSelected: indexSelected == index,
                  onTap: () {
                    setState(() {
                      indexSelected = index;
                    });
                  },
                );
              }),
              SizedBox(height: MediaQuery.of(context).size.height * 0.06),
              CustomButton(
                text: 'Continuar',
                onPressed: () {
                  if(indexSelected >= 0){
                  Navigator.push(
                    context, 
                    MaterialPageRoute(
                      builder: (context) => const RegistrationHeight()
                      )
                      );
                      }else{
                        showDialog(
                          context: context, 
                          builder: (context) => AlertDialog(
                            title: Text("Error"),
                            content: Text("Debe seleccionar al menos uno"),
                            actions: [
                              CustomButton(
                                text: "OK", 
                                onPressed: (){
                                  Navigator.of(context).pop();
                                }, 
                                width: 0.5, 
                                icon: Icons.check, 
                                color: Colors.black
                                )
                            ],
                          ),
                          );
                      }
                },
                width: 0.8,
                icon: Icons.arrow_forward,
                color: Colors.black,
              ),
            ],
          ),
        ],
      ),
    );
  }
}
