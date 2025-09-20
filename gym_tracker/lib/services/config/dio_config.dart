import 'package:dio/dio.dart';

class DioConfig {
  static final DioConfig _instance = DioConfig._internal();
  late final Dio dio;

  factory DioConfig() {
    return _instance;
  }

  DioConfig._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: 'http://localhost:3000/api/',
        connectTimeout: const Duration(seconds: 5),
        receiveTimeout: const Duration(seconds: 10),
        headers: {'Content-Type': 'application/json'},
      ),
    );

    //Interceptor log para depuración
    dio.interceptors.add(
      LogInterceptor(request: true, requestBody: true, responseBody: true),
    );
  }
}
