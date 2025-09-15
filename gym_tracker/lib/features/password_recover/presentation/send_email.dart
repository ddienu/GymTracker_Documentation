import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/begin/widgets/custombutton.dart';

class SendEmail extends StatefulWidget {
  final String email;

  const SendEmail({super.key, required this.email});

  @override
  State<StatefulWidget> createState() => _SendEmailPageState();
}

class _SendEmailPageState extends State<SendEmail> {
  bool isAlreadySended = false;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0.0,
        leading: IconButton(
          onPressed: () => {Navigator.pop(context)},
          icon: Icon(Icons.arrow_back),
        ),
      ),
      body: Stack(
        children: [
          Positioned.fill(
            child: Image.asset(
              "recover_password/recover_password_background.png",
              fit: BoxFit.cover,
            ),
          ),
          Center(
            child: Container(
              margin: EdgeInsets.symmetric(horizontal: 30),
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                color: Colors.white
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  SizedBox(height: 10),
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: Colors.lightGreen.shade200,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(Icons.check, color: Colors.green),
                  ),
                  SizedBox(height: MediaQuery.of(context).size.height * 0.03),
                  Text(
                    "Correo enviado",
                    style: GoogleFonts.workSans(
                      color: Colors.black,
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  SizedBox(height: MediaQuery.of(context).size.height * 0.02),
                  Text(
                    "Hemos enviado la contraseña al correo ${widget.email}. Presiona en el botón reenviar si no lo recibes. (Valida en el correo no deseado).",
                    textAlign: TextAlign.center,
                    style: GoogleFonts.workSans(
                      color: Colors.grey.shade600,
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  SizedBox(height: MediaQuery.of(context).size.height * 0.03),
                  isAlreadySended
                      ? SizedBox()
                      : CustomButton(
                          text: "Reenviar contraseña",
                          onPressed: () => {
                            setState(() {
                              isAlreadySended = true;
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text("Correo reenviado con éxito ✅"),
                                  backgroundColor: Colors.black,
                                  duration: Duration(seconds: 3),
                                ),
                              );
                            })
                          },
                          width: 0.8,
                          icon: Icons.lock,
                          color: Colors.black,
                        )
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
