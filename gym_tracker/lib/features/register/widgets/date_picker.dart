import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class DatePickerField extends StatefulWidget {
  final String label;

  const DatePickerField({super.key, required this.label});

  @override
  State<DatePickerField> createState() => _DatePickerFieldState();
}

class _DatePickerFieldState extends State<DatePickerField> {
  final TextEditingController _dateController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: _dateController,
      readOnly: true,
      decoration: InputDecoration(
        labelText: widget.label,
        prefixIcon: const Icon(Icons.calendar_today),
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
          return 'La fecha no puede estar vacía';
        }
        return null;
      },
      onTap: () async {
        FocusScope.of(context).requestFocus(FocusNode()); // 👈 evita teclado
        DateTime? pickedDate = await showDatePicker(
          context: context,
          initialDate: DateTime.now(),
          firstDate: DateTime(1900),
          lastDate: DateTime.now(),
          locale: const Locale("es", "ES"), // 👈 en español
        );

        if (pickedDate != null) {
          String formattedDate = DateFormat("dd/MM/yyyy").format(pickedDate);
          setState(() {
            _dateController.text = formattedDate;
          });
        }
      },
    );
  }
}
