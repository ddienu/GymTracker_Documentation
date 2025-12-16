import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:gym_tracker/core/services/token_storage.dart';

class ApiClient {
  // Para Web (Chrome) usa localhost
  //static const String baseUrl = 'http://localhost:3000/api';
  
  // Para Android Emulator usa:
  static const String baseUrl = 'http://192.168.0.13:3000/api';
  
  // Para dispositivo físico usa tu IP:
  // static const String baseUrl = 'http://192.168.1.XXX:3000/api';
  
  // Headers básicos sin autenticación
  static Map<String, String> get basicHeaders => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Headers con autenticación (incluye el JWT)
  static Future<Map<String, String>> getAuthHeaders() async {
    final token = await TokenStorage.getToken();
    
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }
  
  // GET request sin autenticación
  static Future<http.Response> get(String endpoint) async {
    final url = Uri.parse('$baseUrl$endpoint');
    return await http.get(url, headers: basicHeaders);
  }
  
  // GET request con autenticación
  static Future<http.Response> getAuth(String endpoint) async {
    final url = Uri.parse('$baseUrl$endpoint');
    final headers = await getAuthHeaders();
    return await http.get(url, headers: headers);
  }
  
  // POST request sin autenticación
  static Future<http.Response> post(String endpoint, Map<String, dynamic> body) async {
    final url = Uri.parse('$baseUrl$endpoint');
    return await http.post(
      url,
      headers: basicHeaders,
      body: json.encode(body),
    );
  }
  
  // POST request con autenticación
  static Future<http.Response> postAuth(String endpoint, Map<String, dynamic> body) async {
    final url = Uri.parse('$baseUrl$endpoint');
    final headers = await getAuthHeaders();
    return await http.post(
      url,
      headers: headers,
      body: json.encode(body),
    );
  }
  
  // PUT request con autenticación
  static Future<http.Response> putAuth(String endpoint, Map<String, dynamic> body) async {
    final url = Uri.parse('$baseUrl$endpoint');
    final headers = await getAuthHeaders();
    return await http.put(
      url,
      headers: headers,
      body: json.encode(body),
    );
  }
  
  // DELETE request con autenticación
  static Future<http.Response> deleteAuth(String endpoint) async {
    final url = Uri.parse('$baseUrl$endpoint');
    final headers = await getAuthHeaders();
    return await http.delete(url, headers: headers);
  }
}
