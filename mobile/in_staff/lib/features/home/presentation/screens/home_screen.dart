import 'dart:io';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'ios_home.dart';
import 'android_home.dart';


class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Platform.isIOS ? const IOSHome() : const AndroidHome();
  }
}
