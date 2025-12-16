import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:gym_tracker/features/payments/data/models/payment_method_model.dart';
import 'package:gym_tracker/core/services/token_storage.dart';

class PaymentService {
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

  Future<List<PaymentMethod>> fetchPaymentMethods() async {
    final uri = Uri.parse('$_baseUrl/payment-methods');
    final headers = await _getHeaders();

    try {
      final response = await http.get(uri, headers: headers);

      if (response.statusCode == 200) {
        final List<dynamic> jsonList = jsonDecode(response.body);
        return jsonList
            .map((json) => PaymentMethod.fromJson(json))
            .where((method) => method.isActive == 1)
            .toList();
      } else {
        throw Exception(
          'Error al cargar métodos de pago: ${response.statusCode}',
        );
      }
    } catch (e) {
      throw Exception('Error de conexión: $e');
    }
  }

  Future<Map<String, dynamic>> createOrder(int paymentMethodId) async {
    final uri = Uri.parse('$_baseUrl/orders');
    final headers = await _getHeaders();

    final body = jsonEncode({
      'paymentMethodId': paymentMethodId,
    });

    print('Creando orden con método de pago: $paymentMethodId');
    print('URL: $uri');
    print('Headers: $headers');
    print('Body: $body');

    try {
      final response = await http.post(uri, headers: headers, body: body);

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Error al crear la orden: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      print('Error al crear orden: $e');
      throw Exception('Error de conexión: $e');
    }
  }
}
