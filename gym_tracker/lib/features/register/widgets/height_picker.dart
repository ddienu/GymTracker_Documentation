import 'package:flutter/material.dart';
import 'package:numberpicker/numberpicker.dart';

class HeightNumberPicker extends StatefulWidget {
  const HeightNumberPicker({super.key});

  @override
  State<HeightNumberPicker> createState() => _HeightNumberPickerState();
}

class _HeightNumberPickerState extends State<HeightNumberPicker> {
  int height = 170;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          "$height cm",
          style: const TextStyle(
            fontSize: 48,
            fontWeight: FontWeight.bold,
            color: Colors.white,
            shadows: [
              Shadow(
                offset: Offset(2, 2),
                blurRadius: 4,
                color: Colors.black26,
              ),
            ],
          ),
        ),
        SizedBox(height: MediaQuery.of(context).size.height * 0.1),
        Container(
          padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
          decoration: BoxDecoration(
            color: Colors.white24,
            borderRadius: BorderRadius.circular(16),
          ),
          child: NumberPicker(
            value: height,
            minValue: 120,
            maxValue: 220,
            itemHeight: 100,
            itemWidth: 100,
            axis: Axis.horizontal,
            onChanged: (value) => setState(() => height = value),
            selectedTextStyle: const TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            textStyle: TextStyle(
              fontSize: 22,
              color: Colors.deepOrange,
            ),
          ),
        ),
        const SizedBox(height: 20),

        // Hint extra para UX
        const Text(
          "*Desliza para ajustar tu estatura",
          style: TextStyle(
            fontSize: 16,
            color: Colors.white70,
            fontStyle: FontStyle.italic,
          ),
        ),
      ],
    );
  }
}
