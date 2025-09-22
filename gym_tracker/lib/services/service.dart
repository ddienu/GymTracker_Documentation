import 'package:dio/dio.dart';
import 'package:gym_tracker/services/config/dio_config.dart';

class ServiceService{
  final Dio _dio = DioConfig().dio;

  Future<List<dynamic>> getProducts() async {
    final response = await _dio.get('services');
    return response.data;
  }
}