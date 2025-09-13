import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/begin/widgets/custombutton.dart';
import 'package:gym_tracker/features/profile/widget/avatar_selection.dart';

class EditAvatar extends StatelessWidget {
  const EditAvatar({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          "Editar foto de perfil",
          style: GoogleFonts.workSans(
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            SizedBox(height: MediaQuery.of(context).size.height * 0.04),
            AvatarSelector(),
            SizedBox(height: MediaQuery.of(context).size.height * 0.04),
            Text(
              "Selecciona tu avatar",
              style: GoogleFonts.workSans(
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
            ),
            Column(
              children: [
                SizedBox(height: MediaQuery.of(context).size.height * 0.07),
                Material(
                  color: Colors.transparent,
                  child: InkWell(
                    onTap: () {
                      print("Subiendo imagen");
                    },
                    borderRadius: BorderRadius.circular(100),
                    child: Ink(
                      width: 140,
                      height: 140,
                      decoration: BoxDecoration(
                        border: Border.all(),
                        borderRadius: BorderRadius.circular(100),
                        color: Colors.grey.shade300,
                        gradient: LinearGradient(
                          colors: [
                            Colors.orange.shade300,
                            Colors.deepOrangeAccent,
                          ],
                        ),
                        // gradient: LinearGradient(colors: [Colors.orange.shade900, Colors.deepOrangeAccent.shade100])
                      ),
                      child: Icon(Icons.upload, size: 40, color: Colors.white),
                    ),
                  ),
                ),
                SizedBox(height: MediaQuery.of(context).size.height * 0.07),
                Text(
                  "O sube tu mejor foto",
                  style: GoogleFonts.workSans(
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                Text(
                  "Max 5mb, Format: jpg,png",
                  style: GoogleFonts.workSans(
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                    color: Colors.grey.shade600,
                  ),
                ),
              ],
            ),
            SizedBox(height: MediaQuery.of(context).size.height * 0.06),
            CustomButton(
              text: 'Guardar',
              onPressed: () {
                showDialog(
                  context: context,
                  builder: (context) => AlertDialog(
                    // title: Text("Éxito"),
                    content: Text("Imagen cargada satisfactoriamente"),
                    actions: [
                      CustomButton(
                        text: "OK",
                        onPressed: () {
                          Navigator.pop(context);
                        },
                        width: 0.5,
                        icon: Icons.check,
                        color: Colors.black,
                      ),
                    ],
                  ),
                );
              },
              width: 0.8,
              icon: Icons.arrow_forward,
              color: Colors.black,
            ),
          ],
        ),
      ),
    );
  }
}
