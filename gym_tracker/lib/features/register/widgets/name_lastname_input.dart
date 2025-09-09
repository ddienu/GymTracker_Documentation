import 'package:flutter/material.dart';

class NameField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  final Widget? icon;
  final bool isANumberInput;

  const NameField({super.key, required this.controller, required this.label, required this.icon, required this.isANumberInput});

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      keyboardType: TextInputType.name,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: icon,
        floatingLabelStyle: const TextStyle(color: Color(0xFFF97316)),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.grey, width: 1.5),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: Color(0xFFF97316), // naranja
            width: 2.0,
          ),
        ),
      ),
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'El campo no puede estar vacío';
        }
        if (!RegExp(r"^[a-zA-ZÀ-ÿ\s]+$").hasMatch(value) && !isANumberInput) {
          return 'Solo se permiten letras y espacios';
        }
        return null;
      },
    );
  }
}
