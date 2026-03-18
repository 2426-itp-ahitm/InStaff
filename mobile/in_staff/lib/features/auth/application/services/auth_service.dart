import 'dart:io';
import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AuthService {
  final FlutterAppAuth _appAuth = FlutterAppAuth();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  final String clientId = 'instaff-flutter';
  final String redirectUrl = 'com.instaff.app://oauthredirect';

  final String issuer = Platform.isAndroid
    ? 'http://10.0.2.2:8081/realms/demo'
    : 'http://localhost:8081/realms/demo';

  Future<void> login() async {
    print("LOGIN START");
    final baseUrl = Platform.isAndroid
        ? 'http://10.0.2.2:8081'
        : 'http://localhost:8081';

    final result = await _appAuth.authorizeAndExchangeCode(
      AuthorizationTokenRequest(
        clientId,
        redirectUrl,
        serviceConfiguration: AuthorizationServiceConfiguration(
          authorizationEndpoint: '$baseUrl/realms/demo/protocol/openid-connect/auth',
          tokenEndpoint: '$baseUrl/realms/demo/protocol/openid-connect/token',
        ),
        scopes: ['openid', 'profile', 'email'],
        allowInsecureConnections: true,
      ),
    );

    if (result != null) {
      //print("ACCESS TOKEN: ${result.accessToken}");
      await _storage.write(key: 'access_token', value: result.accessToken);
      await _storage.write(key: 'refresh_token', value: result.refreshToken);
    }
  }

  Future<String?> getAccessToken() async {
    return await _storage.read(key: 'access_token');
  }

  Future<void> logout() async {
    await _storage.deleteAll();
  }
}