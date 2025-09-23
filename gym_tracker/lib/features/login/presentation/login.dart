import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/begin/widgets/custombutton.dart';
import 'package:gym_tracker/features/home/presentation/homepage.dart';
import 'package:gym_tracker/features/login/widget/input_field.dart';
import 'package:gym_tracker/features/password_recover/presentation/recover_password.dart';
import 'package:gym_tracker/features/register/presentation/registration_email_password.dart';
import 'package:gym_tracker/repositories/auth.dart';
import 'package:gym_tracker/services/auth_service.dart';

class Login extends StatelessWidget {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final AuthService authService;
  late final AuthRepository _authRepository = AuthRepository(authService);

  Login({super.key, required this.authService});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: Column(
        children: [
          Container(
            height: MediaQuery.of(context).size.height * 0.31,
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
                SizedBox(height: MediaQuery.of(context).size.height * 0.1),
                Image.asset(
                  'login/login_logo.png',
                  filterQuality: FilterQuality.high,
                  fit: BoxFit.cover,
                ),
                SizedBox(height: MediaQuery.of(context).size.height * 0.01),
                Center(
                  child: Text(
                    "Inicio de sesión",
                    style: GoogleFonts.workSans(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
          SizedBox(height: MediaQuery.of(context).size.height * 0.02),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 20),
                  Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        InputField(
                          controller: emailController,
                          label: "Correo electrónico",
                          keyboardType: TextInputType.emailAddress,
                          icon: Icons.email,
                          isPassword: false,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return "El correo electrónico no puede estar vacío";
                            }

                            // if (!RegExp(
                            //   r'^[^@]+@[^@]+\.[^@]+',
                            // ).hasMatch(value)) {
                            //   return 'Ingresa un correo válido';
                            // }
                            return null;
                          },
                        ),
                        const SizedBox(height: 50),
                        InputField(
                          controller: passwordController,
                          label: "Contraseña",
                          keyboardType: TextInputType.visiblePassword,
                          icon: Icons.lock,
                          isPassword: true,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return "La contraseña no puede estar vacía";
                            }
                            return null;
                          },
                        ),
                      ],
                    ),
                  ),
                  SizedBox(height: MediaQuery.of(context).size.height * 0.04),
                  CustomButton(
                    text: "Iniciar sesión",
                    onPressed: () async {
                      if (_formKey.currentState!.validate()) {
                        try {
                          final response = await _authRepository.login(
                            emailController.text,
                            passwordController.text,
                          );
                          return showDialog(
                            context: context,
                            barrierDismissible:
                                false, // evita que lo cierren tocando afuera
                            builder: (context) {
                              // disparar la acción después de que se construya el diálogo
                              Future.delayed(const Duration(seconds: 3), () {
                                Navigator.pop(context); // cierra el diálogo
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) => HomePage(),
                                  ),
                                );
                              });

                              return AlertDialog(
                                backgroundColor: Colors.green,
                                content: const Text(
                                  "Iniciando sesión...",
                                  style: TextStyle(color: Colors.white),
                                ),
                              );
                            },
                          );
                        } catch (e) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(e.toString()),
                              backgroundColor: Colors.red,
                            ),
                          );
                        }
                        //    return showDialog(
                        //       context: context,
                        //       barrierDismissible:
                        //           false, // evita que lo cierren tocando afuera
                        //       builder: (context) {
                        //         // disparar la acción después de que se construya el diálogo
                        //         Future.delayed(const Duration(seconds: 3), () {
                        //           Navigator.pop(context); // cierra el diálogo
                        //           Navigator.push(
                        //             context,
                        //             MaterialPageRoute(
                        //               builder: (context) => HomePage(),
                        //             ),
                        //           );
                        //         });

                        //         return AlertDialog(
                        //           backgroundColor: Colors.green,
                        //           content: const Text("Iniciando sesión...", style: TextStyle(color: Colors.white),),
                        //         );
                        //       },
                        //     ),
                        // }
                        // {
                      }
                    },
                    width: 0.4,
                    icon: Icons.arrow_forward,
                    color: Colors.black,
                  ),
                  SizedBox(height: MediaQuery.of(context).size.height * 0.07),
                  Column(
                    children: [
                      RichText(
                        text: TextSpan(
                          style: const TextStyle(
                            fontSize: 16,
                            color: Colors.black,
                            fontFamily: 'WorkSans',
                          ),
                          children: [
                            const TextSpan(
                              text: "¿No tienes cuenta? Regístrate ",
                            ),
                            TextSpan(
                              text: "aquí",
                              style: const TextStyle(
                                color: Color(0xFFF97316),
                                fontWeight: FontWeight.bold,
                                decoration: TextDecoration.underline,
                                fontSize: 16,
                              ),
                              recognizer: TapGestureRecognizer()
                                ..onTap = () => Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        RegistrationEmailPassword(),
                                  ),
                                ),
                            ),
                          ],
                        ),
                      ),
                      SizedBox(
                        height: MediaQuery.of(context).size.height * 0.05,
                      ),
                      RichText(
                        text: TextSpan(
                          text: "¿Olvidaste tu contraseña?",
                          style: TextStyle(
                            color: Color(0xFFF97316),
                            fontWeight: FontWeight.bold,
                            decoration: TextDecoration.underline,
                            fontSize: 16,
                          ),
                          recognizer: TapGestureRecognizer()
                            ..onTap = () => Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => RecoverPassword(),
                              ),
                            ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
