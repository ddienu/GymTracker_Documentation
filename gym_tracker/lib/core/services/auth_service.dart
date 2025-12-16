import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:gym_tracker/core/services/token_storage.dart';

class AuthService {
  // Para Web (Chrome) usa localhost
  //static const String baseUrl = 'http://localhost:3000/api/auth';
  
  // Para Android Emulator usa:
  static const String baseUrl = 'http://192.168.0.13:3000/api/auth';
  
  // Para dispositivo físico usa tu IP:
  // static const String baseUrl = 'http://192.168.1.XXX:3000/api/auth';
  
  // Login y captura del JWT
  // Nota: El parámetro se llama 'username' pero puede ser email o username según tu API
  static Future<Map<String, dynamic>> login(String emailOrUsername, String password) async {
    try {
      print('Intentando login en: $baseUrl/login');
      print('Email/Username: $emailOrUsername');
      
      final response = await http.post(
        Uri.parse('$baseUrl/login'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: json.encode({
          'email': emailOrUsername,  // Cambiado de 'username' a 'email'
          'password': password,
        }),
      );

      print('Status code: ${response.statusCode}');
      print('Response body: ${response.body}');
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        
        // Extraer el token y los datos del usuario
        final token = data['token'] as String;
        final user = data['user'] as Map<String, dynamic>;
        
        // Guardar el token de forma segura
        await TokenStorage.saveToken(token);
        await TokenStorage.saveUserData(user);
        
        print('Login exitoso. Token guardado.');
        
        return {
          'success': true,
          'message': data['message'],
          'user': user,
          'token': token,
        };
      } else {
        print('Error ${response.statusCode}: ${response.body}');
        final errorData = json.decode(response.body);
        return {
          'success': false,
          'message': errorData['message'] ?? 'Error al iniciar sesión',
        };
      }
    } catch (e) {
      print('Excepción: $e');
      return {
        'success': false,
        'message': 'Error de conexión: ${e.toString()}',
      };
    }
  }

  // Verificar si el usuario está autenticado
  static Future<bool> isAuthenticated() async {
    final token = await TokenStorage.getToken();
    return token != null && token.isNotEmpty;
  }

  // Cerrar sesión
  static Future<void> logout() async {
    await TokenStorage.clearAll();
  }

  // Obtener el token actual
  static Future<String?> getToken() async {
    return await TokenStorage.getToken();
  }

  // Obtener datos del usuario
  static Future<Map<String, dynamic>?> getUserData() async {
    return await TokenStorage.getUserData();
  }
}
