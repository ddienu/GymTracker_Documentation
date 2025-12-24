import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart'; // 👈 importante
import 'package:gym_tracker/features/appoinment_details/presentation/appointment_detail.dart';
import 'package:gym_tracker/features/confirmation/presentation/confirmation.dart';
import 'package:gym_tracker/features/confirmation/presentation/NutritionConfirmation.dart';
import 'package:gym_tracker/features/appoinment_details/presentation/appointment_detail_nutritionist.dart';
import 'package:gym_tracker/features/appoinment_details/presentation/appointment_detail_physio.dart';
import 'package:gym_tracker/features/begin/presentation/begin.dart';
import 'package:gym_tracker/features/confirmation/presentation/PhysioterapyConfirmation.dart';
import 'package:gym_tracker/features/create_appoinments/appoinments_info.dart';
import 'package:gym_tracker/features/detail_appointment_history/detail_appointment_history.dart';
import 'package:gym_tracker/features/home/presentation/homepage.dart';
import 'package:gym_tracker/features/initial/presentation/initial_page.dart';
import 'package:gym_tracker/features/login/presentation/login.dart';
import 'package:gym_tracker/features/meal_plan/presentation/meal_plan_page.dart';
import 'package:gym_tracker/features/medical_appointments_history/presentation/medical_appointment_history.dart';
import 'package:gym_tracker/features/my_appointments/appointments%20.dart';
import 'package:gym_tracker/features/my_routines/presentation/my_routines.dart';
import 'package:gym_tracker/features/notification/presentation/notification.dart';
import 'package:gym_tracker/features/password_recover/presentation/recover_password.dart';
import 'package:gym_tracker/features/schedule_appointment/presentation/schedule_calendar.dart';
import 'package:gym_tracker/features/settings/presentation/settings.dart';
import 'package:gym_tracker/features/progress/progress.dart';
import 'package:gym_tracker/theme/custom_theme.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GymTrackerApp',
      theme: AppTheme.lightTheme,
      // theme: ThemeData(
      //   useMaterial3: true,
      // ),
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

      home: InitialPage(),
      initialRoute: '/',
      routes: {
        'begin': (context) => Begin(),
        'recover': (context) => RecoverPassword(),
      },
    );
  }
}
