import 'package:flutter/material.dart';

class Confirmation extends StatefulWidget {
  const Confirmation({super.key});

  @override
  State<Confirmation> createState() => _ConfirmationState();
}

class _ConfirmationState extends State<Confirmation> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand, // 🔹 Hace que la imagen cubra todo el fondo
        children: [
          // Fondo con imagen
          Image.asset(
            'assets/confirmation/confirmation_one.png',
             // cambia al path de tu imagen
            fit: BoxFit.cover, // 🔹 Para que cubra toda la pantalla
          ),

          // Capa oscura encima (opcional, si quieres darle contraste al texto)
          Container(
            color: Colors.black.withOpacity(0.4),
          ),

          // Contenido principal
          Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                Icon(Icons.check_circle,
                    size: 80, color: Colors.greenAccent),
                SizedBox(height: 20),
                Text(
                  "Pantalla de confirmación",
                  style: TextStyle(
                    fontSize: 22,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
