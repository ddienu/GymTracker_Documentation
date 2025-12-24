import 'package:flutter/widgets.dart';
import 'package:gym_tracker/features/service/widget/service_card.dart';
import 'package:gym_tracker/models/service.dart';

class BuildServiceGrid extends StatelessWidget {

  final List<ServiceModel> services;
  const BuildServiceGrid({
    super.key, 
    required this.services
    });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 1,
          childAspectRatio: 4,
          crossAxisSpacing: 20,
          mainAxisSpacing: 10,
        ),
        itemCount: services.length,
        itemBuilder: (context, index) {
          return ServiceCard(service: services[index]);
        },
      ),
    );
  }
}
