import 'package:gym_tracker/features/payments/data/models/order_models.dart';
import 'package:gym_tracker/core/services/token_storage.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ApiService {
  // Para Android Emulator usa 192.168.0.13
  final String _baseUrl = "http://192.168.0.13:3000/api";
  // Para Web usa: "http://localhost:3000/api"
  // Para dispositivo físico usa tu IP: "http://192.168.1.XXX:3000/api"

  Future<Map<String, String>> _getHeaders() async {
    final token = await TokenStorage.getToken();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<List<OrderModels>> fetchOrders() async {
    final uri = Uri.parse('$_baseUrl/orders');
    final headers = await _getHeaders();

    print('Obteniendo órdenes desde: $uri');

    try {
      final response = await http.get(uri, headers: headers);

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200) {
        final List<dynamic> decodedJson = jsonDecode(response.body);

        final List<OrderModels> orders = decodedJson.map((jsonItem) {
          return OrderModels.fromJson(jsonItem);
        }).toList();

        print('Órdenes cargadas: ${orders.length}');
        return orders;
      } else {
        throw Exception('Error al cargar órdenes: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      print('Error al cargar órdenes: $e');
      throw Exception('Fallo la carga de ordenes: $e');
    }
  }
}
