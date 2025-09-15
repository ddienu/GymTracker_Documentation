import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class SelectableCardTarget extends StatefulWidget {
  final String label;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const SelectableCardTarget({
    super.key,
    required this.label,
    required this.icon,
    required this.isSelected,
    required this.onTap,
  });

  @override
  State<StatefulWidget> createState() => _SelectableCardTargetState();
}

class _SelectableCardTargetState extends State<SelectableCardTarget> {
  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: widget.onTap,
      child: Card(
        elevation: 4,
        color: widget.isSelected ? Color(0xFFF97316) : Colors.grey.shade300,
        margin: EdgeInsets.all(12),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: BorderSide(
            color: widget.isSelected ? Colors.orangeAccent : Colors.transparent,
            width: 2.0

          ),
        ),
        child: Padding(
          padding: const EdgeInsets.all(18.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(
                widget.icon,
                color: widget.isSelected ? Colors.white : Colors.grey.shade700,
              ),
              SizedBox(width: MediaQuery.of(context).size.width * 0.04),
              Expanded(
                child: Text(
                  widget.label,
                  style: GoogleFonts.workSans(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: widget.isSelected ? Colors.white : Colors.black,
                  ),
                ),
              ),
              Icon(
                widget.isSelected
                    ? Icons.radio_button_checked
                    : Icons.radio_button_off,
                color: widget.isSelected ? Colors.white : Colors.grey.shade700,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
