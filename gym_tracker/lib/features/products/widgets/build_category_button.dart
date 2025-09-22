import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class BuildCategoryButton extends StatefulWidget {
  final String title;
  final String category;
  final String selectedCategory;
  final VoidCallback onTap;

  const BuildCategoryButton({
    super.key,
    required this.title,
    required this.category,
    required this.selectedCategory,
    required this.onTap,
  });

  @override
  State<BuildCategoryButton> createState() => _BuildCategoryButtonState();
}

class _BuildCategoryButtonState extends State<BuildCategoryButton> {
  @override
  Widget build(BuildContext context) {
    final bool isSelected = widget.selectedCategory == widget.category;

    return GestureDetector(
      onTap: widget.onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 20),
        decoration: BoxDecoration(
          color: isSelected ? Theme.of(context).colorScheme.primary : Colors.grey[300],
          borderRadius: BorderRadius.circular(25),
        ),
        child: Text(
          widget.title,
          textAlign: TextAlign.center,
          style: GoogleFonts.workSans(
            color: isSelected ? Colors.white : Colors.grey[600],
            fontWeight: FontWeight.w600,
            fontSize: 16,
          ),
        ),
      ),
    );
  }
}
