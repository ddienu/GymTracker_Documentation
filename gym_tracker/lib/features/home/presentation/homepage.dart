import 'package:flutter/material.dart';
import 'package:gym_tracker/features/cart/presentation/cart_page.dart';
import 'package:gym_tracker/features/home/widget/card_item.dart';
import 'package:gym_tracker/features/home/widget/my_account.dart';
import 'package:gym_tracker/features/meal_plan/presentation/meal_plan_page.dart';
import 'package:gym_tracker/features/my_appointments/appointments%20.dart';
import 'package:gym_tracker/features/my_routines/presentation/my_routines.dart';
import 'package:gym_tracker/features/notification/presentation/notification.dart';
import 'package:gym_tracker/features/payments/presentation/payments_history_page.dart';
import 'package:gym_tracker/features/products/presentation/clean_products_page.dart';
import 'package:gym_tracker/features/settings/presentation/settings.dart';
import 'package:gym_tracker/features/progress/progress.dart';


class HomePage extends StatelessWidget {
  const HomePage({super.key});

  List<Map<String, dynamic>> _getItems(BuildContext context) => [
    {
      "containerColor": const Color(0xFFF97316),
      "cardWidget": Image(
        image: const AssetImage("assets/profile/profile_image.png"),
        fit: BoxFit.cover,
        errorBuilder: (context, error, stackTrace) {
          return const Icon(
            Icons.person,
            color: Colors.white,
            size: 30,
          );
        },
      ),
      "cardTitle": "Mi progreso",
      "cardSubtitle": "Revisa tu progreso",
      "onTap": () => {
         Navigator.push(context, MaterialPageRoute(builder: (context)=>Progress())),
        },
    },
    {
      "containerColor": const Color(0xFF2563EB), // blue
      "cardWidget": const Icon(Icons.water_drop, color: Colors.white, size: 30),
      "cardTitle": "Consulta tus citas",
      "cardSubtitle": "Consulta tus citas agendadas con especialistas",
      "onTap": () {
        Navigator.push(context, MaterialPageRoute(builder: (context)=>Appointments()));
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
        Navigator.push(context, MaterialPageRoute(builder: (context)=>MyRoutine()));
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
        print("Entrando");
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
      "onTap": () => Navigator.push(context, MaterialPageRoute(builder: (context)=>CleanProductsPage())),
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
              icon: Text("Notificaciones", style: TextStyle(fontSize: 25)),
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
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const CartPage()),
                );
              },
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
