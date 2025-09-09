import 'package:flutter/material.dart';
import 'package:sleek_circular_slider/sleek_circular_slider.dart';

class CustomDial extends StatefulWidget {
  const CustomDial({super.key});

  @override
  State<CustomDial> createState() => _CustomDialState();
}

class _CustomDialState extends State<CustomDial> {
  double value = 3;

  String getLabel(double val) {
    switch (val.toInt()) {
      case 1:
        return "Muy malo";
      case 2:
        return "Malo";
      case 3:
        return "Regular";
      case 4:
        return "Bueno";
      case 5:
        return "Excelente";
      default:
        return "";
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        SleekCircularSlider(
          min: 1,
          max: 5,
          initialValue: value,
          appearance: CircularSliderAppearance(
            startAngle: 180,
            angleRange: 180,
            size: 300,
            customWidths: CustomSliderWidths(
              progressBarWidth: 30,
              trackWidth: 50,
              handlerSize: 20,
            ),
            customColors: CustomSliderColors(
              progressBarColor: Colors.orange,
              trackColor: Colors.black54,
              dotColor: Colors.white,
            ),
            infoProperties: InfoProperties(

              mainLabelStyle: const TextStyle(
                fontSize: 120,
                fontWeight: FontWeight.w500,
                color: Colors.black,
              ),
              modifier: (val) {
                return val.toInt().toString();
              },
            ),
          ),
          onChange: (newValue) {
            setState(() => value = newValue);
          },
        ),
        Text(
          getLabel(value), // 👈 se recalcula dinámicamente
          style: const TextStyle(
            fontSize: 32,
            fontWeight: FontWeight.bold,
            color: Colors.black87,
          ),
        ),
        Text(
          "*Desliza para ajustar tu estado físico",
          style: TextStyle(
            fontSize: 16,
            color: Colors.black45,
            fontStyle: FontStyle.italic,
          ),
        ),
      ],
    );
  }
}
