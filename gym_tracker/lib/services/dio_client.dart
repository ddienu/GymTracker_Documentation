import 'package:dio/dio.dart';

class DioClient {
  late Dio dio;

  DioClient() {
    dio = Dio(
      BaseOptions(
        baseUrl: "http://localhost:3000/api/", // URL base de tu backend
        connectTimeout: const Duration(seconds: 10),
        receiveTimeout: const Duration(seconds: 10),
        responseType: ResponseType.json,
        headers: {
          "Content-Type": "application/json",
        },
      ),
    );

    // Interceptor para logs (útil en desarrollo)
    dio.interceptors.add(LogInterceptor(
      request: true,
      requestBody: true,
      responseBody: true,
      responseHeader: false,
    ));

    // Ejemplo: Interceptor para añadir token automáticamente
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        // Aquí podrías recuperar el token de almacenamiento seguro
        // String? token = SecureStorage.getToken();
        String? token; 
        if (token != null) {
          options.headers["Authorization"] = "Bearer $token";
        }
        return handler.next(options);
      },
      onError: (DioException e, handler) {
        // Aquí podrías manejar errores globales (401, timeouts, etc.)
        return handler.next(e);
      },
    ));
  }
}
