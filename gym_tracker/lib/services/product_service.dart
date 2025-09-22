import 'package:dio/dio.dart';
import 'package:gym_tracker/services/config/dio_config.dart';

class ProductService{
  final Dio _dio = DioConfig().dio;

  Future<List<dynamic>> getProducts() async {
    try{
    final response = await _dio.get('products');
    if( response.statusCode == 200){
    return response.data;
    }else if( response.statusCode == 204){
      throw ("No hay productos para mostrar");
    }else{
      throw ("Error del servidor");
    }

    }on DioException catch(e){
      throw ("Error al obtener los productos");
    }
  }
}