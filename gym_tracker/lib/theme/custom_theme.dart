import 'package:flutter/material.dart';

class AppTheme {
  static final ThemeData lightTheme = ThemeData(
    brightness: Brightness.light,
    useMaterial3: true,
    colorScheme: const ColorScheme.light(
      // Naranja principal
      primary: Color(0xFFFF6B00), // naranja vibrante
      onPrimary: Colors.white,
      primaryContainer: Color(0xFFFFE0B2), // naranja pastel claro
      onPrimaryContainer: Color(0xFF1C1B1F), // gris muy oscuro casi negro

      // Secundario gris
      secondary: Color(0xFF616161), // gris medio
      onSecondary: Colors.white,
      secondaryContainer: Color(0xFFE0E0E0), // gris claro
      onSecondaryContainer: Color(0xFF212121), // gris oscuro

      // Terciario naranja más suave
      tertiary: Color(0xFFFF9800), // naranja intermedio
      onTertiary: Colors.black,
      tertiaryContainer: Color(0xFFFFF3E0), // naranja pastel muy claro
      onTertiaryContainer: Color(0xFF212121),

      surface: Colors.white,
      onSurface: Color(0xFF212121),

      error: Color(0xFFD32F2F),
      onError: Colors.white,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFFFF6B00),
      foregroundColor: Colors.white,
      centerTitle: true,
    ),
    textTheme: const TextTheme(
      titleLarge: TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.bold,
        color: Color(0xFF212121), // gris oscuro
      ),
      bodyMedium: TextStyle(fontSize: 16, color: Color(0xFF212121)),
      bodySmall: TextStyle(color: Color(0xFF616161)), // gris medio
    ),
    dividerColor: Color(0xFFBDBDBD),
    scaffoldBackgroundColor: Colors.white,
  );

  static final ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    useMaterial3: true,
    colorScheme: const ColorScheme.dark(
      primary: Color.fromARGB(255, 202, 15, 193), // naranja principal
      onPrimary: Colors.black,
      primaryContainer: Color(0xFF7C2D12), // naranja más oscuro
      onPrimaryContainer: Colors.white,

      secondary: Color(0xFF9E9E9E), // gris claro
      onSecondary: Colors.black,
      secondaryContainer: Color(0xFF424242), // gris oscuro
      onSecondaryContainer: Colors.white,

      tertiary: Color(0xFFFF9800), // naranja intermedio
      onTertiary: Colors.black,
      tertiaryContainer: Color(0xFF4A2C00), // naranja tostado oscuro
      onTertiaryContainer: Colors.white,

      surface: Color(0xFF121212),
      onSurface: Colors.white,

      error: Color(0xFFEF5350),
      onError: Colors.black,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF1E1E1E),
      foregroundColor: Colors.white,
    ),
    textTheme: const TextTheme(
      titleLarge: TextStyle(
        fontSize: 20,
        fontWeight: FontWeight.bold,
        color: Colors.white,
      ),
      bodyMedium: TextStyle(fontSize: 16, color: Colors.white70),
      bodySmall: TextStyle(color: Colors.white60),
    ),
    dividerColor: Color(0xFF616161),
    scaffoldBackgroundColor: Color(0xFF121212),
  );
}
