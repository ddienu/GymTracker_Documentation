import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TokenStorage {
  // CONFIGURACIÓN DE SEGURIDAD 
  
  // 1. Opciones para Android: Activamos la encriptación fuerte
  static const _androidOptions = AndroidOptions(
    encryptedSharedPreferences: true,
  );

  // 2. Opciones para Web: Usamos las opciones por defecto para navegador
  static const _webOptions = WebOptions(
    dbName: 'gym_tracker',
    publicKey: 'gym_tracker_key',
  );

  // 3. Instancia que decide automáticamente qué opciones usar
  static const _storage = FlutterSecureStorage(
    aOptions: _androidOptions,
    webOptions: _webOptions,
  );

  // CLAVES PARA GUARDAR DATOS
  static const _keyToken = 'auth_token';
  static const _keyUser = 'user_data';

  // --- MÉTODOS DE GUARDADO (Igual que antes, pero con la caja fuerte) ---

  static Future<void> saveToken(String token) async {
    await _storage.write(key: _keyToken, value: token);
  }

  static Future<void> saveUserData(Map<String, dynamic> user) async {
    final userString = json.encode(user);
    await _storage.write(key: _keyUser, value: userString);
  }

  // --- MÉTODOS DE LECTURA ---

  static Future<String?> getToken() async {
    return await _storage.read(key: _keyToken);
  }

  static Future<Map<String, dynamic>?> getUserData() async {
    final userString = await _storage.read(key: _keyUser);
    if (userString != null) {
      return json.decode(userString); // Convertimos texto a Mapa
    }
    return null;
  }

  // --- OBTENER CLIENT ID DEL TOKEN JWT ---

  static Future<int?> getClientIdFromToken() async {
    try {
      final token = await getToken();
      if (token == null) return null;

      // Decodificar el token JWT
      final parts = token.split('.');
      if (parts.length != 3) return null;

      // Decodificar el payload (segunda parte)
      final payload = parts[1];
      final normalized = base64Url.normalize(payload);
      final decoded = utf8.decode(base64Url.decode(normalized));
      final payloadMap = json.decode(decoded) as Map<String, dynamic>;

      // Extraer el clientId (puede estar como 'id', 'clientId', 'client_id', etc.)
      return payloadMap['id'] as int? ?? 
             payloadMap['clientId'] as int? ?? 
             payloadMap['client_id'] as int?;
    } catch (e) {
      print('Error al decodificar token: $e');
      return null;
    }
  }

  // --- LIMPIEZA (LOGOUT) ---

  static Future<void> clearAll() async {
    await _storage.deleteAll();
  }
}