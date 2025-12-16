import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:gym_tracker/features/cart/data/models/cart_item_model.dart';
import 'package:gym_tracker/core/services/token_storage.dart';

class CartService {
  // Para Android Emulator usa 192.168.0.13
  final String _baseUrl = "http://192.168.0.16:3000/api";
  // Para Web usa: "http://localhost:3000/api"
  // Para dispositivo físico usa tu IP: "http://192.168.1.XXX:3000/api"

  Future<Map<String, String>> _getHeaders() async {
    final token = await TokenStorage.getToken();
    print('Token Obtenido: $token');
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  // Agregar producto al carrito
  Future<void> addToCart({
    required String itemType, // 'product' o 'service'
    required int itemId,
    int quantity = 1,
  }) async {
    // Obtener clientId del token JWT
    final clientId = await TokenStorage.getClientIdFromToken();
    
    if (clientId == null) {
      throw Exception('No se pudo obtener el ID del cliente del token');
    }

    final uri = Uri.parse('$_baseUrl/cart/$clientId');
    final headers = await _getHeaders();
    
    // Construir el body con itemType, itemId y quantity
    final bodyData = {
      'itemType': itemType.toLowerCase(),
      'itemId': itemId,
      'quantity': quantity,
    };

    final body = jsonEncode(bodyData);

    print('Agregando al carrito: $itemType #$itemId (cantidad: $quantity) para cliente $clientId');
    print('URL: $uri');
    print('Body: $body');

    try {
      final response = await http.post(uri, headers: headers, body: body);

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        print('Item agregado al carrito exitosamente');
      } else {
        throw Exception('Error al agregar al carrito: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      print('Error al agregar al carrito: $e');
      throw Exception('Error de conexión: $e');
    }
  }

  Future<CartResponse> fetchCart() async {
    // Obtener clientId del token JWT
    final clientId = await TokenStorage.getClientIdFromToken();
    
    if (clientId == null) {
      throw Exception('No se pudo obtener el ID del cliente del token');
    }

    final uri = Uri.parse('$_baseUrl/cart/$clientId');
    final headers = await _getHeaders();

    try {
      final response = await http.get(uri, headers: headers);

      if (response.statusCode == 200) {
        final Map<String, dynamic> decodedJson = jsonDecode(response.body);
        return CartResponse.fromJson(decodedJson);
      } else {
        throw Exception('Error al cargar el carrito: ${response.statusCode}');
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  Future<void> updateQuantity(int itemId, int quantity, {String itemType = 'product'}) async {
    // Obtener clientId del token JWT
    final clientId = await TokenStorage.getClientIdFromToken();
    
    if (clientId == null) {
      throw Exception('No se pudo obtener el ID del cliente del token');
    }

    // Construir la URL correcta según el tipo
    final endpoint = itemType.toLowerCase() == 'service' 
        ? '$_baseUrl/cart/services/$itemId'
        : '$_baseUrl/cart/products/$itemId';
    
    final uri = Uri.parse(endpoint);
    final headers = await _getHeaders();
    final body = jsonEncode({'quantity': quantity});

    print('Actualizando cantidad: itemId=$itemId, quantity=$quantity, type=$itemType');
    print('URL: $uri');

    try {
      final response = await http.put(uri, headers: headers, body: body);

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode != 200) {
        throw Exception('Error al actualizar cantidad: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      print('Error al actualizar cantidad: $e');
      rethrow;
    }
  }

  Future<void> removeItem(int itemId, {String itemType = 'product'}) async {
    // Construir la URL correcta según el tipo
    final endpoint = itemType.toLowerCase() == 'service' 
        ? '$_baseUrl/cart/services/$itemId'
        : '$_baseUrl/cart/products/$itemId';
    
    final uri = Uri.parse(endpoint);
    final headers = await _getHeaders();

    print('Eliminando item: itemId=$itemId, type=$itemType');
    print('URL: $uri');

    try {
      final response = await http.delete(uri, headers: headers);

      print('Response status: ${response.statusCode}');

      if (response.statusCode != 200 && response.statusCode != 204) {
        throw Exception('Error al eliminar item: ${response.statusCode}');
      }
    } catch (e) {
      print('Error al eliminar item: $e');
      rethrow;
    }
  }

  Future<void> clearCart() async {
    // Obtener clientId del token JWT
    final clientId = await TokenStorage.getClientIdFromToken();
    
    if (clientId == null) {
      throw Exception('No se pudo obtener el ID del cliente del token');
    }

    final uri = Uri.parse('$_baseUrl/cart/$clientId');
    final headers = await _getHeaders();

    final response = await http.delete(uri, headers: headers);

    if (response.statusCode != 200 && response.statusCode != 204) {
      throw Exception('Error al limpiar el carrito');
    }
  }
}
