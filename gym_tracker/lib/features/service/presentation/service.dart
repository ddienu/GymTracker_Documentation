import 'package:flutter/material.dart';

class Service extends StatefulWidget{
  const Service({super.key});
  
  @override
  State<StatefulWidget> createState() => _ServicePageState();
}

class _ServicePageState extends State<Service> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Text("Hola mundo"),
    );
  }

}