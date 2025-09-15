import 'dart:convert';

import 'package:gym_tracker/services/dio_client.dart';

class ProductsService {
  final DioClient _client;

  ProductsService(this._client);

  Future getProducts() async {
    final response = await _client.dio.get(
      "products"
    );
    return response.data;
  }

  
}