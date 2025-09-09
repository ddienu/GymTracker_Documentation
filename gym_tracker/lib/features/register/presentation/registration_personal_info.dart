import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/begin/widgets/custombutton.dart';
import 'package:gym_tracker/features/register/presentation/registration_age.dart';
import 'package:gym_tracker/features/register/widgets/appbar_custom.dart';
import 'package:gym_tracker/features/register/widgets/date_picker.dart';
import 'package:gym_tracker/features/register/widgets/have_account_already.dart';
import 'package:gym_tracker/features/register/widgets/name_lastname_input.dart';

class RegistrationPersonalInfo extends StatelessWidget {
  final _formKey = GlobalKey<FormState>();
  final nameController = TextEditingController();
  final lastNameController = TextEditingController();
  final birthDateController = TextEditingController();
  final documentNumberController = TextEditingController();

  RegistrationPersonalInfo({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: AppBarCustom(label: "Registro", pageCounter: "1"),
      ),
      body: Column(
        children: [
          SizedBox(height: MediaQuery.of(context).size.height * 0.04),
          Container(
            padding: EdgeInsets.all(12),
            child: Text(
              "Completa tu información personal",
              style: GoogleFonts.workSans(
                color: Colors.black,
                fontSize: 32,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
          ),
          SizedBox(height: MediaQuery.of(context).size.height * 0.03),
          Padding(
            padding: EdgeInsetsGeometry.all(12),
            child: Form(
              key: _formKey,
              child: Column(
                children: [
                  NameField(
                    controller: nameController,
                    label: 'Nombres',
                    icon: Icon(Icons.person),
                    isANumberInput: false,
                  ),
                  SizedBox(height: MediaQuery.of(context).size.height * 0.03),
                  NameField(
                    controller: lastNameController,
                    label: 'Apellidos',
                    icon: Icon(Icons.people),
                    isANumberInput: false,
                  ),
                  SizedBox(height: MediaQuery.of(context).size.height * 0.03),
                  DatePickerField(label: 'Fecha de nacimiento'),
                  SizedBox(height: MediaQuery.of(context).size.height * 0.03),
                  NameField(
                    controller: documentNumberController,
                    label: 'Número de documento',
                    icon: Icon(Icons.document_scanner),
                    isANumberInput: true,
                  ),
                  SizedBox(height: MediaQuery.of(context).size.height * 0.05),
                  CustomButton(
                    text: "Continuar",
                    width: 0.8,
                    icon: Icons.arrow_forward,
                    color: Colors.black,
                    onPressed: () {
                      if(_formKey.currentState!.validate()){
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => const RegistrationAge()
                            )
                          );
                      }

                      // ScaffoldMessenger.of(context).showSnackBar(
                      //   SnackBar(
                      //     content: Text("Campos incompletos")
                      //     )
                      //   );
                    },
                  ),
                  SizedBox(height: MediaQuery.of(context).size.height * 0.05),
                  HaveAnAccountAlready(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
