import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/theme/custom_theme.dart';

class SettingsCard extends StatelessWidget {
  final String title;
  final IconData icon;
  final VoidCallback onTap;
  final Widget trailing;

  const SettingsCard({
    super.key,
    required this.title,
    required this.icon,
    required this.onTap,//funcionalidad
    required this.trailing,//icono de flecha
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(30.0),
      ),
      elevation: 5,
      margin: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 30.0),
      child: ListTile(
        leading: Icon(icon, color: Colors.black),
        title: Text(title, style: GoogleFonts.workSans(  
          fontSize: 16,
          fontWeight: FontWeight.bold,
          color: Colors.black,
        )),
        trailing: trailing, iconColor: AppTheme.lightTheme.primaryColor,
        onTap: onTap,
      ),
    );
  }
}