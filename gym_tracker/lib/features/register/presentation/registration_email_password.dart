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
  final _emailKey = GlobalKey<FormState>();
  final _passwordKey = GlobalKey<FormState>();

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
          Form(
            key: _emailKey,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 30),
              child: EmailField(
                controller: emailController, 
                label: "Correo electrónico"
                ),
            ),
          ),
          SizedBox(height: MediaQuery.of(context).size.height * 0.03),
          Form(
            key: _passwordKey,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 30),
              child: Column(
                children: [
                  PasswordField(
                    controller: passwordController,
                    label: "Contraseña",
                    validateStrength: true,
                  ),
                  SizedBox(height: MediaQuery.of(context).size.height * 0.03),
                  PasswordField(
                    controller: confirmPasswordController,
                    label: "Confirmar contraseña",
                    validateStrength: false,
                  ),
                ],
              ),
            ),
          ),
          SizedBox(height: MediaQuery.of(context).size.height * 0.08),
          CustomButton(
            text: 'Continuar',
            onPressed: () {
              if(_emailKey.currentState!.validate() && _passwordKey.currentState!.validate()){
                if(passwordController.text.trim() != confirmPasswordController.text.trim()){
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text("Las contraseñas no coinciden"),
                      backgroundColor: Colors.red,
                      duration: Duration(seconds: 3)
                      ),
                  );
                      return; 
                }

                Navigator.push(
                  context, 
                  MaterialPageRoute(
                    builder: (context) => RegistrationPersonalInfo()
                    )
                  );
              }
            },
            width: 0.9,
            icon: Icons.arrow_forward,
            color: Colors.black,
          ),
          SizedBox(height: MediaQuery.of(context).size.height * 0.1),
          HaveAnAccountAlready()
        ],
      ),
    );
  }
}
