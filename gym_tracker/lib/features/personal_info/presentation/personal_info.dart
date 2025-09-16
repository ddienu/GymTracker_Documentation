import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/begin/widgets/custombutton.dart';
import 'package:gym_tracker/features/login/widget/input_field.dart';
import 'package:gym_tracker/features/profile/presentation/edit_avatar.dart';

class PersonalInfo extends StatelessWidget {
  PersonalInfo({super.key});

  final _formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController lastNameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Avatar
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
              child: Center(
                child: Stack(
                  children: [
                    const CircleAvatar(
                      radius: 70,
                      backgroundImage: AssetImage("profile/profile_image.png"),
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        width: 30,
                        height: 30,
                        decoration: BoxDecoration(
                          color: Color(0xFFF97316),
                          borderRadius: BorderRadius.circular(18),
                        ),
                        child: IconButton(
                          padding: EdgeInsets.zero,
                          icon: const Icon(Icons.edit),
                          color: Colors.white,
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => const EditAvatar(),
                              ),
                            );
                          },
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ),

            SizedBox(height: MediaQuery.of(context).size.height * 0.02),

            Text(
              "Información personal",
              style: GoogleFonts.workSans(
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
            ),

            SizedBox(height: MediaQuery.of(context).size.height * 0.02),

            // Formulario
            Padding(
              padding: const EdgeInsets.all(20),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    InputField(
                      controller: nameController,
                      label: "Nombres",
                      keyboardType: TextInputType.text,
                      icon: Icons.person_2_outlined,
                      isPassword: false,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "El nombre no puede estar vacío";
                        }
                        if (!RegExp(r'^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$').hasMatch(value)) {
                          return "El apellido solo puede contener letras y espacios";
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: MediaQuery.of(context).size.height * 0.03),
                    InputField(
                      controller: lastNameController,
                      label: "Apellidos",
                      keyboardType: TextInputType.text,
                      icon: Icons.person_2_outlined,
                      isPassword: false,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "El apellido no puede estar vacío";
                        }
                        if (!RegExp(r'^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]+$').hasMatch(value)) {
                          return "El apellido solo puede contener letras y espacios";
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: MediaQuery.of(context).size.height * 0.03),
                    InputField(      
                      controller: emailController,
                      label: "Correo electrónico",  
                      keyboardType: TextInputType.emailAddress,
                      icon: Icons.email_outlined,                  
                      isPassword: false,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "El correo electrónico no puede estar vacío";
                        }
                        if (!RegExp(r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$').hasMatch(value)) {
                          return "Ingresa un correo válido";
                        }
                        return null;
                      }
                    ),
                    SizedBox(height: MediaQuery.of(context).size.height * 0.03),
                    InputField(      
                      controller: phoneController,
                      label: "Numero de teléfono",  
                      keyboardType: TextInputType.phone,
                      icon: Icons.phone_outlined,                  
                      isPassword: false,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "El número telefonico no puede estar vacío";
                        }
                        if (!RegExp(r'^[0-9]{10}$').hasMatch(value)) {
                          return "Ingresa un número válido (7-15 dígitos)";
                        }
                        return null;
                      }
                    ),
                    SizedBox(height: MediaQuery.of(context).size.height * 0.03),
                        InputField(
                          controller: passwordController,
                          label: "Contraseña",
                          keyboardType: TextInputType.visiblePassword,
                          icon: Icons.lock_outlined,
                          isPassword: true,
                          validator: (value) {
                           if (value == null || value.isEmpty) {
                          return "La contraseña no puede estar vacía";
                        }
                        if (!RegExp(r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$').hasMatch(value)) {
                          return "Debe tener al menos 8 caracteres, una mayúscula, un número y un caracter especial";
                        }
                        return null;
                      },
                        ),
                  ],
                ),
              ),
              ),
              SizedBox(height: MediaQuery.of(context).size.height * 0.04),
              CustomButton(
                    text: "Guardar",
                    onPressed: ()  {
                      if (_formKey.currentState!.validate())
                        {
                          showDialog(
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
                                    builder: (context) => PersonalInfo(),
                                  ),
                                );
                              });

                              return AlertDialog(
                                backgroundColor: Colors.orange,
                                content: const Text("Guardando...", style: TextStyle(color: Colors.white),),
                              );
                            },
                          );
                        }
                    },
                    width: 0.4,
                    icon: Icons.arrow_forward,
                    color: Colors.black,
                  ),
         
          ],
        ),
      ),
    );
  }
}