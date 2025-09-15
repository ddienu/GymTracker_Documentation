import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/notification/widget/notification_card.dart';

class Notifications extends StatelessWidget {
  final List<Map<String, dynamic>> notificationItems = [
    {
      "onTap": () {
        print("Entrando");
      },
      "date": "17/Agosto/2025",
      "title": "Sesión con entrenador personal",
      "subtitle": "Valoración inicial",
      "color": Colors.white,
      "imagePath": "notifications/training_appointment.png",
    },
    {
      "onTap": () {
        print("Entrando");
      },
      "date": "17/Agosto/2025",
      "title": "Cita con nutrición + plan nutricional",
      "subtitle": "",
      "color": Colors.white,
      "imagePath": "notifications/meet.jpg",
    },
    {
      "onTap": () {
        print("Entrando");
      },
      "date": "17/Agosto/2025",
      "title": "Recordatorio de pago",
      "subtitle": "Tu afilicación al gimnasio vence pronto, no olvides realizar tu pago.",
      "color": Colors.white,
      "imagePath": "notifications/payment_reminder.jpg",
    },
  ];

  Notifications({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        surfaceTintColor: Colors.transparent,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              height: MediaQuery.of(context).size.height * 0.31,
              width: double.infinity,
              decoration: const BoxDecoration(
                image: DecorationImage(
                  image: AssetImage('login/logo_background.png'),
                  filterQuality: FilterQuality.high,
                  fit: BoxFit.cover,
                  opacity: 0.8,
                ),
              ),
              child: Image(
                image: AssetImage("profile/profile_image.png"),
                alignment: Alignment.bottomCenter * 0.7,
              ),
            ),
            SizedBox(height: MediaQuery.of(context).size.height * 0.02),
            Text(
              "🔔 Notificaciones",
              style: GoogleFonts.workSans(
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: MediaQuery.of(context).size.height * 0.02),
            ...notificationItems.map(
              (notification) => NotificationCard(
                onTap: notification['onTap'],
                date: notification['date'],
                title: notification['title'],
                subtitle: notification['subtitle'],
                imagePath: notification['imagePath'],
                fontColor: notification['color'],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
