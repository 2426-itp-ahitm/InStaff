import 'package:flutter/cupertino.dart';

class IOSProfileScreen extends StatelessWidget {
  const IOSProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      child: CustomScrollView(
        slivers: [
          const CupertinoSliverNavigationBar(
            largeTitle: Text('Profil'),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: const Text("Profil Inhalt"),
            ),
          ),
        ],
      ),
    );
  }
}