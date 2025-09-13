import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/profile/widget/avatar_selection.dart';

class EditAvatar extends StatelessWidget {
  const EditAvatar({super.key});

  @override
  Widget build(Object context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Editar foto de perfil",
          style: GoogleFonts.workSans(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: AvatarSelector()
    );
  }
}
