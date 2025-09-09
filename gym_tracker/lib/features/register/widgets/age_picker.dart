import 'package:flutter/material.dart';

class AgePicker extends StatefulWidget {
  const AgePicker({super.key});

  @override
  State<AgePicker> createState() => _AgePickerState();
}

class _AgePickerState extends State<AgePicker> {
  int selectedAge = 0; // edad inicial

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        SizedBox(
          height: MediaQuery.of(context).size.height * 0.7,
          child: ListWheelScrollView.useDelegate(
            itemExtent: 70, // alto de cada item
            perspective: 0.0015, // efecto 3D más suave
            diameterRatio: 1.5,
            physics: const FixedExtentScrollPhysics(),
            onSelectedItemChanged: (index) {
              setState(() {
                selectedAge = index; // 👈 empiezas en 10 años, por ej.
              });
            },
            childDelegate: ListWheelChildBuilderDelegate(
              builder: (context, index) {
                if (index > 100) return null;
                if( index < 0) return null; // límite hasta 100 años
                final age = index;
                final isSelected = age == selectedAge;

                return Container(
                  alignment: Alignment.center,
                  width: MediaQuery.of(context).size.width * 0.4,
                  decoration: isSelected
                      ? BoxDecoration(
                          color: const Color(0xFFF97316), // naranja
                          borderRadius: BorderRadius.circular(12),
                        )
                      : null,
                  child: Text(
                    "$age",
                    style: TextStyle(
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                      color: isSelected ? Colors.white : Colors.black54,
                    ),
                  ),
                );
              },
            ),
          ),
        ),
      ],
    );
  }
}
