import 'package:flutter/material.dart';
import 'package:in_staff/features/home/presentation/screens/home_screen.dart';
import '../../application/services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  late final AuthService _authService;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _authService = AuthService();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Login")),
      body: Center(
        child: ElevatedButton(
          onPressed: () async {
            if (_isLoading) return;

            setState(() => _isLoading = true);

            try {
              await _authService.login();

              final token = await _authService.getAccessToken();

              if (token != null && context.mounted) {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(
                    builder: (context) => const HomeScreen(),
                  ),
                );
              }
            } catch (e) {
              debugPrint(e.toString());
            } finally {
              if (mounted) {
                setState(() => _isLoading = false);
              }
            }
          },
          child: _isLoading
              ? const CircularProgressIndicator()
              : const Text("Login mit Keycloak"),
        ),
      ),
    );
  }  
}