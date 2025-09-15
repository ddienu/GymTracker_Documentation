import 'package:flutter/material.dart';

class InputField extends StatelessWidget {
  final TextEditingController controller;
  final TextInputType keyboardType;
  final String label;
  final IconData icon;
  final String? Function(String?)? validator;
  final bool isPassword;

  const InputField({
    super.key,
    required this.controller,
    required this.label,
    required this.keyboardType, 
    required this.icon, 
    required this.validator, 
    required this.isPassword,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: isPassword,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
        floatingLabelStyle: TextStyle(color: const Color(0xFFF97316)),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey, width: 1.5),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: Color(0xFFF97316), // naranja
            width: 2.0,
          ),
        ),
      ),
      validator: validator
    );
  }
}
