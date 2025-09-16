import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:gym_tracker/features/notification/presentation/notification.dart';
import 'package:gym_tracker/features/settings/widgets/settings_card.dart';
import 'package:gym_tracker/theme/custom_theme.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool _isDarkMode = false;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        centerTitle: true,
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
            ),
            SizedBox(height: MediaQuery.of(context).size.height * 0.02),
            Text(
              "Configuración de la\n cuenta",
              style: GoogleFonts.workSans(
                fontSize: 28,
                fontWeight: FontWeight.bold,
              ),
              textAlign: TextAlign.center,
            ),
            SizedBox(height: MediaQuery.of(context).size.height * 0.02),
            // Lista de opciones
            SettingsCard(
              title: "Notificaciones",
              icon: Icons.notifications_outlined,
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (context) => Notifications()));
              },
              trailing: Icon(Icons.arrow_forward),
            ),
            SettingsCard(
              title: "Información personal",
              icon: Icons.person_outline,
              onTap: () {},
              trailing: Icon(Icons.arrow_forward),
            ),
            SettingsCard(
              title: "Contacto entrenador",
              icon: Icons.phone_android_outlined,
              onTap: () {},
              trailing: Icon(Icons.arrow_forward),
            ),
            SettingsCard(
              title: "Modo oscuro",
              icon: Icons.dark_mode_outlined,
              onTap: () {
                setState(() {
                  _isDarkMode = !_isDarkMode;
                });
              },
              trailing: SizedBox(
                width: 30,
                child: Switch(
                  activeThumbColor: Colors.orange,
                  value: _isDarkMode,
                  onChanged: (value) {
                    setState(() {
                      _isDarkMode = value;
                    });
                  },
                ),
              ),
            ),
            SettingsCard(
              title: "Cerrar sesión",
              icon: Icons.logout_outlined,
              onTap: () {},
              trailing: Icon(
                Icons.arrow_forward,
                color: AppTheme.lightTheme.primaryColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
