import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class GenderCard extends StatefulWidget {
  const GenderCard({super.key});

  @override
  State<GenderCard> createState() => _GenderCardState();
}

class _GenderCardState extends State<GenderCard> {
  String selected = "Mujer";

  Widget buildCard(String label, String imageUrl, IconData icon) {
    final bool isSelected = selected == label;

    return GestureDetector(
      onTap: () {
        setState(() {
          selected = label;
        });
      },
      child: Container(
        height: 170,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(28),
          border: Border.all(
            color: isSelected ? Colors.orange : Colors.transparent,
            width: 4,
          ),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: Stack(
            fit: StackFit.expand,
            children: [
              // Imagen de fondo
              Image(
                image: AssetImage(
                  imageUrl
                ),
                fit: BoxFit.cover,
                filterQuality: FilterQuality.high,
              ),

              // Degradado oscuro para legibilidad
              Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Colors.black26, Colors.transparent],
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                  ),
                ),
              ),

              // Texto + checkbox encima
              Positioned(
                left: 16,
                top: 16,
                child: Row(
                  children: [
                    Icon(
                      icon
                    ),
                    Text(
                      label,
                      style: GoogleFonts.workSans(
                        fontSize: 16,
                        fontWeight: FontWeight.bold
                      ),
                    )
                  ],
                )
                ),
              Positioned(
                left: 16,
                bottom: 16,
                child: Icon(
                      isSelected
                          ? Icons.check_circle
                          : Icons.radio_button_unchecked,
                      color: isSelected ? Colors.orange : Colors.white,
                      size: 28,
                    ),               
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            buildCard("Hombre",
                "gender/male_gender.png", Icons.male),
            buildCard("Mujer",
                "gender/female_gender.png", Icons.female),
          ],
        ),
      ),
    );
  }
}
