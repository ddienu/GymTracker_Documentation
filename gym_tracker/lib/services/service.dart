import 'package:dio/dio.dart';
import 'package:gym_tracker/services/config/dio_config.dart';

class ServiceService {
  final Dio _dio = DioConfig().dio;

  Future<List<dynamic>> getProducts() async {
    try {
      final response = await _dio.get('services');
      if (response.statusCode == 200) {
        return response.data;
      } else if (response.statusCode == 204) {
        throw ("No hay servicios para mostrar");
      } else {
        throw ("Error del servidor");
      }
    } on DioException catch (e) {
      throw ("Error al obtener los servicios");
    }
  }
}
