import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/begin/widgets/custombutton.dart';
import 'package:gym_tracker/features/register/presentation/registration_personal_info.dart';
import 'package:gym_tracker/features/register/widgets/email_field.dart';
import 'package:gym_tracker/features/register/widgets/have_account_already.dart';
import 'package:gym_tracker/features/register/widgets/password_field.dart';

class RegistrationEmailPassword extends StatelessWidget {
  RegistrationEmailPassword({super.key});

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();

  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0.0,
        leading: IconButton(
          onPressed: () => {Navigator.pop(context)},
          icon: Icon(Icons.arrow_back),
        ),
      ),
      body: Column(
        children: [
          // --- Encabezado con logo ---
          Container(
            height: MediaQuery.of(context).size.height * 0.32,
            width: double.infinity,
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: AssetImage('login/logo_background.png'),
                filterQuality: FilterQuality.high,
                fit: BoxFit.cover,
                opacity: 0.8,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              mainAxisSize: MainAxisSize.max,
              children: [
                SizedBox(height: MediaQuery.of(context).size.height * 0.07),
                Image.asset(
                  'login/login_logo.png',
                  filterQuality: FilterQuality.high,
                  fit: BoxFit.cover,
                ),
                SizedBox(height: MediaQuery.of(context).size.height * 0.01),
                Center(
                  child: Column(
                    children: [
                      Text(
                        "Registro",
                        style: GoogleFonts.workSans(
                          fontSize: 26,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        "Crea tu cuenta",
                        style: GoogleFonts.workSans(
                          fontSize: 14,
                          color: Colors.grey.shade600,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          SizedBox(height: MediaQuery.of(context).size.height * 0.05),

          // --- Formulario completo ---
          Form(
            key: _formKey,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 30),
              child: Column(
                children: [
                  // Campo de correo
                  EmailField(
                    controller: emailController,
                    label: "Correo electrónico",
                  ),
                  SizedBox(height: MediaQuery.of(context).size.height * 0.03),

                  // Campo de contraseña
                  PasswordField(
                    controller: passwordController,
                    label: "Contraseña",
                    validateStrength: true,
                    validator: (value) {
                      final regExp = RegExp(
                        r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$',
                      );
                      if (value == null || value.isEmpty) {
                        return "La contraseña no puede estar vacía";
                      }
                      if (!regExp.hasMatch(value)) {
                        return '* La contraseña debe tener entre 8 y 16 caracteres\n'
                            '* Al menos un dígito\n'
                            '* Al menos una minúscula\n'
                            '* Al menos una mayúscula\n'
                            '* Y al menos un carácter no alfanumérico.';
                      }
                      return null;
                    },
                  ),
                  SizedBox(height: MediaQuery.of(context).size.height * 0.03),

                  // Confirmar contraseña
                  PasswordField(
                    controller: confirmPasswordController,
                    label: "Confirmar contraseña",
                    validateStrength: false,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return "Por favor confirma tu contraseña";
                      }
                      if (value != passwordController.text) {
                        return "Las contraseñas no coinciden";
                      }
                      return null;
                    },
                  ),
                ],
              ),
            ),
          ),

          SizedBox(height: MediaQuery.of(context).size.height * 0.08),

          // --- Botón continuar ---
          CustomButton(
            text: 'Continuar',
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => RegistrationPersonalInfo(),
                  ),
                );
              }
            },
            width: 0.9,
            icon: Icons.arrow_forward,
            color: Colors.black,
          ),

          SizedBox(height: MediaQuery.of(context).size.height * 0.1),
          HaveAnAccountAlready(),
        ],
      ),
    );
  }
}
