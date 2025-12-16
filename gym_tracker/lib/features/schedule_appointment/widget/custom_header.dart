import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CustomHeader extends StatelessWidget {
  final String title;
  final String backgroundImage;
  final double height;
  final Color textColor;

  const CustomHeader({
    super.key,
    required this.title,
    required this.backgroundImage,
    this.height = 0.30,
    this.textColor = Colors.black,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        Container(
          height: MediaQuery.of(context).size.height * height,
          width: double.infinity,
          decoration: BoxDecoration(
            image: DecorationImage(
              image: AssetImage(backgroundImage),
              fit: BoxFit.cover,
              filterQuality: FilterQuality.high,
              opacity: 0.9,
            ),
          ),
        ),
        Container(
          height: MediaQuery.of(context).size.height * height,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Colors.transparent,
                Colors.black.withOpacity(0.3),
              ],
            ),
          ),
        ),
        Positioned(
          bottom: 20,
          child: Text(
            title,
            style: GoogleFonts.workSans(
              color: Colors.white,
              fontSize: 28,
              fontWeight: FontWeight.bold,
              shadows: [
                const Shadow(
                  color: Colors.black54,
                  blurRadius: 6,
                  offset: Offset(1, 2),
                )
              ],
            ),
            textAlign: TextAlign.center,
          ),
        ),
      ],
    );
  }
}
