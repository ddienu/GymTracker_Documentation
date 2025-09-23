import 'package:dio/dio.dart';
import 'package:gym_tracker/models/login_dto.dart';
import 'package:gym_tracker/services/config/dio_config.dart';

class AuthService{
  final Dio _dio = DioConfig().dio;

  Future<String> login(LoginDto loginPayload) async {
    try{
      final response = await _dio.post(
        "/auth/login",
        data: loginPayload.toJson(),
        options: Options(
          headers: {"Content-type": "application/json"}
        )
      );
      if(response.statusCode == 200){
        return response.data['token'];
      }
      throw ("Error iniciando sesión");
    }on DioException catch (e) {
      if(e.response?.statusCode == 400){
        throw("Los campos no pueden estar vacíos");
      }else if(e.response?.statusCode == 401){
        throw("Usuario y contraseña incorrectos.");
      }
      if (e.response != null) {
        throw ("Error en la API: ${e.response?.data}");
      } else {
        throw "Error de red: ${e.message}";
      }
    }

  }
}