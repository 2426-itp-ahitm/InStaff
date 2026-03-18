import 'package:flutter/material.dart';
import 'package:in_staff/core/theme/app_theme.dart';
import 'package:in_staff/features/auth/presentation/screens/login_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'InStaff',
      theme: AppTheme.light(),
      home: LoginScreen(),
    );
  }
}