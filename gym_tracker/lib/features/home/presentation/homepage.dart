import 'package:flutter/material.dart';
import 'package:gym_tracker/features/home/widget/card_item.dart';
import 'package:gym_tracker/features/home/widget/my_account.dart';
import 'package:gym_tracker/features/meal_plan/presentation/meal_plan_page.dart';
import 'package:gym_tracker/features/notification/presentation/notification.dart';
import 'package:gym_tracker/features/payments/presentation/payments_history_page.dart';
import 'package:gym_tracker/features/products/presentation/products_page.dart';
import 'package:gym_tracker/features/service/presentation/service.dart';
import 'package:gym_tracker/features/settings/presentation/settings.dart';

class HomePage extends StatelessWidget {
  HomePage({super.key});

  List<Map<String, dynamic>> _getItems(BuildContext context) => [
    {
      "containerColor": const Color(0xFFF97316),
      "cardWidget": const Image(
        image: AssetImage("profile/profile_image.png"),
        fit: BoxFit.cover,
      ),
      "cardTitle": "Mi progreso",
      "cardSubtitle": "Revisa tu progreso",
      "onTap": () {
        print("Entrando");
      },
    },
    {
      "containerColor": const Color(0xFF2563EB), // blue
      "cardWidget": const Icon(Icons.water_drop, color: Colors.white, size: 30),
      "cardTitle": "Consulta tus citas",
      "cardSubtitle": "Consulta tus citas agendadas con especialistas",
      "onTap": () {
        print("Entrando");
      },
    },
    {
      "containerColor": const Color(0xFF22C55E), // green
      "cardWidget": const Icon(
        Icons.fitness_center,
        color: Colors.white,
        size: 30,
      ),
      "cardTitle": "Consulta tus rutinas",
      "cardSubtitle": "Consulta tus rutinas asignadas por el especialista",
      "onTap": () {
        print("Entrando");
      },
    },
    {
      "containerColor": const Color(0xFFDC2626), // red
      "cardWidget": const Icon(
        Icons.restaurant_menu,
        color: Colors.white,
        size: 30,
      ),
      "cardTitle": "Consulta tu plan alimentario",
      "cardSubtitle":
          "Consulta tus planes alimentarios asignados por especialistas",
      "onTap": () => Navigator.push(context, MaterialPageRoute(builder: (context)=>MealPlanPage())),
    },
    {
      "containerColor": const Color(0xFF8B5CF6), // purple
      "cardWidget": const Icon(
        Icons.miscellaneous_services,
        color: Colors.white,
        size: 30,
      ),
      "cardTitle": "Servicios",
      "cardSubtitle": "Consulta los servicios disponibles",
      "onTap": () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => const Service()
            )
        );
      },
    },
    {
      "containerColor": const Color(0xFFFACC15), // yellow
      "cardWidget": const Icon(
        Icons.shopping_cart,
        color: Colors.white,
        size: 30,
      ),
      "cardTitle": "Productos",
      "cardSubtitle": "Consulta los productos disponibles",
      "onTap": () => Navigator.push(context, MaterialPageRoute(builder: (context)=>ProductsPage())),
    },
    {
      "containerColor": const Color(0xFFEF4444), // red-ish
      "cardWidget": const Icon(Icons.payment, color: Colors.white, size: 30),
      "cardTitle": "Pagos",
      "cardSubtitle": "Observa tu historico",
      "onTap": () => Navigator.push(context, MaterialPageRoute(builder: (context)=>PaymentsHistoryPage())),
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.white, Colors.black45],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: AppBar(
          automaticallyImplyLeading: false,
          backgroundColor: Colors.transparent,
          actions: [
            IconButton(
              icon: Text("🔔", style: TextStyle(fontSize: 25)),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => Notifications()
                    )
                );
              },
            ),
            IconButton(
              icon: Text("⚙️", style: TextStyle(fontSize: 25)),
              onPressed: () {
                Navigator.push(
                  context, 
                  MaterialPageRoute(
                    builder: (context) => const SettingsPage()
                    )
                  );
              },
            ),
            IconButton(
              icon: Text("🛒", style: TextStyle(fontSize: 25)),
              onPressed: () {},
            ),
          ],
        ),
        body: ListView(
          children: [
            SizedBox(height: MediaQuery.of(context).size.height * 0.02),
            Center(
              child: MyAccount()
            ),
            SizedBox(height: MediaQuery.of(context).size.height * 0.02),
            Column(
              children: [
                ..._getItems(context).map(
                  (item) => CardItem(
                    containerColor: item['containerColor'],
                    cardWidget: item['cardWidget'],
                    cardTitle: item['cardTitle'],
                    cardSubtitle: item['cardSubtitle'],
                    onTap: item['onTap'],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
