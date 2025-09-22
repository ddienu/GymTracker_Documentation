class ServiceModel{
  final int serviceId;
  final String name;
  final String description;
  final double price;
  final String serviceType;
  final int durationDays;
  final bool isActive;

  const ServiceModel({
    required this.serviceId, 
    required this.name, 
    required this.description, 
    required this.price, 
    required this.serviceType, 
    required this.durationDays, 
    required this.isActive
    });

    factory ServiceModel.fromJson(Map<String, dynamic> json){
      return ServiceModel(
        serviceId: json['service_id'] as int,
        name: json['name'].toString(),
        description: json['description'] as String,
        price: double.parse(json['price']),
        serviceType: json['service_type'].toString(),
        durationDays: json['duration_days'] as int,
        isActive: json['is_active'] == 1
      );

    }


}