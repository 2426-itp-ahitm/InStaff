import 'package:flutter/cupertino.dart';
import '../../../shifts/presentation/screens/ios_shifts_screen.dart';
import '../../../profile/presentation/screens/ios_profile_scree.dart';

class IOSHome extends StatelessWidget {
  const IOSHome();

  @override
  Widget build(BuildContext context) {
    return CupertinoTabScaffold(
      tabBar: CupertinoTabBar(
        activeColor: CupertinoColors.systemGreen,
        inactiveColor: CupertinoColors.systemGrey,
        items: [
          BottomNavigationBarItem(
            icon: const Icon(CupertinoIcons.calendar),
            label: "Schichten",
          ),
          BottomNavigationBarItem(
            icon: const Icon(CupertinoIcons.person),
            label: "Profil",
          ),
        ],
      ),
      tabBuilder: (context, index) {
        return CupertinoTabView(
          builder: (context) {
            switch (index) {
              case 0:
                return const IOSShiftsScreen();
              case 1:
                return const IOSProfileScreen();
              default:
                return const IOSShiftsScreen();
            }
          },
        );
      },
    );
  }
}