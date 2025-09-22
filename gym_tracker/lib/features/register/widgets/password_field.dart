import 'package:flutter/material.dart';

class PasswordField extends StatefulWidget {
  final TextEditingController controller;
  final String label;
  final FormFieldValidator<String>? validator;
  final bool validateStrength;

  const PasswordField({
    super.key,
    required this.controller,
    required this.label,
    this.validator,
    this.validateStrength = false,
  });

  @override
  State<PasswordField> createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<PasswordField> {
  bool _obscureText = true;

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: widget.controller,
      obscureText: _obscureText,
      decoration: InputDecoration(
        labelText: widget.label,
        prefixIcon: const Icon(Icons.lock),
        suffixIcon: IconButton(
          icon: Icon(
            _obscureText ? Icons.visibility_off : Icons.visibility,
            color: Colors.grey,
          ),
          onPressed: () {
            setState(() {
              _obscureText = !_obscureText;
            });
          },
        ),
        floatingLabelStyle: const TextStyle(color: Color(0xFFF97316)),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Colors.grey, width: 1.5),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(
            color: Color(0xFFF97316),
            width: 2.0,
          ),
        ),
        errorMaxLines: 2
      ),
      validator: (value) {
        if (value == null || value.isEmpty) {
          return 'El campo no puede estar vacío';
        }

        //Si validateStrength es true, se valida con esta expresión regular
        if (widget.validateStrength) {
          if (!RegExp(
                  r'^(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$&*~.,;:?¿¡%\-_=+]).{8,}$')
              .hasMatch(value)) {
            return 'Debe tener 8-16 caracteres, con mayúscula, minúscula, número y símbolo.';
                   
          }
        }

        // En caso de que se indique un validador extra.
        if (widget.validator != null) {
          return widget.validator!(value);
        }

        return null;
      },
    );
  }
}
