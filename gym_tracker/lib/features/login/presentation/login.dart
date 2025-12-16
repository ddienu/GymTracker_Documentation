import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/begin/widgets/custombutton.dart';
import 'package:gym_tracker/features/home/presentation/homepage.dart';
import 'package:gym_tracker/features/login/widget/input_field.dart';
import 'package:gym_tracker/features/password_recover/presentation/recover_password.dart';
import 'package:gym_tracker/features/register/presentation/registration_email_password.dart';
import 'package:gym_tracker/core/services/auth_service.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final result = await AuthService.login(
        emailController.text.trim(),
        passwordController.text,
      );

      if (!mounted) return;

      if (result['success'] == true) {
        // Login exitoso
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result['message'] ?? 'Inicio de sesión exitoso'),
            backgroundColor: Colors.green,
          ),
        );

        // Navegar a la página principal
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => HomePage()),
        );
      } else {
        // Error en el login
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(result['message'] ?? 'Error al iniciar sesión'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } catch (e) {
      if (!mounted) return;
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error inesperado: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white, // Cambiado de transparent a white
      body: Column(
        children: [
          Container(
            height: MediaQuery.of(context).size.height * 0.31,
            width: double.infinity,
            decoration: const BoxDecoration(
              color: Colors.white, // Fondo blanco por defecto
              image: DecorationImage(
                image: AssetImage('assets/login/logo_background.png'), // Agregado 'assets/'
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
                  'assets/login/login_logo.png', // Agregado 'assets/'
                  filterQuality: FilterQuality.high,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    // Fallback si la imagen no se encuentra
                    return Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        color: const Color(0xFFFF6B35),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Icon(
                        Icons.fitness_center,
                        size: 60,
                        color: Colors.white,
                      ),
                    );
                  },
                ),
                SizedBox(height: MediaQuery.of(context).size.height * 0.01),
                Center(
                  child: Text(
                    "Inicio de sesión",
                    style: GoogleFonts.workSans(
                      fontSize: 26,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
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

                            if (!RegExp(
                              r'^[^@]+@[^@]+\.[^@]+',
                            ).hasMatch(value)) {
                              return 'Ingresa un correo válido';
                            }
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
                  _isLoading
                      ? const Center(
                          child: CircularProgressIndicator(),
                        )
                      : CustomButton(
                          text: "Iniciar sesión",
                          onPressed: () => _handleLogin(),
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
