import 'package:flutter/material.dart';

class AndroidShiftsScreen extends StatelessWidget {
  const AndroidShiftsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        Card(
          child: ListTile(
            title: Text("Service"),
            subtitle: Text("18:00 - 23:00"),
            leading: Icon(Icons.work),
          ),
        ),
      ],
    );
  }
}