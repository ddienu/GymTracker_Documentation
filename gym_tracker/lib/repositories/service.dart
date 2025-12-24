import 'package:gym_tracker/models/service.dart';
import 'package:gym_tracker/services/service.dart';

class ServiceRepository{
  final ServiceService service;

  ServiceRepository(this.service);

  Future<List<ServiceModel>> getServices() async {
    final jsonList = await service.getProducts();
    return jsonList.map((json) => ServiceModel.fromJson(json)).toList();
  }
}