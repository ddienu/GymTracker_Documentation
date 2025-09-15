import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart'; // 👈 importante
import 'package:gym_tracker/features/begin/presentation/begin.dart';
import 'package:gym_tracker/features/home/presentation/homepage.dart';
import 'package:gym_tracker/features/login/presentation/login.dart';
import 'package:gym_tracker/features/password_recover/presentation/recover_password.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GymTrackerApp',
      theme: ThemeData(
        useMaterial3: true,
      ),
      debugShowCheckedModeBanner: false,

      // 👇 Localizations necesarias para DatePicker, TimePicker, etc.
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('en', ''), // inglés
        Locale('es', ''), // español
      ],

      home: Login(),
      initialRoute: '/',
      routes: {
        'begin': (context) => const Begin(),
        'login': (context) => Login(),
        'recover': (context) => RecoverPassword(),
      },
    );
  }
}
