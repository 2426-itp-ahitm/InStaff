import 'package:flutter/cupertino.dart';
import 'package:in_staff/features/shifts/presentation/widgets/ios_shift_card.dart';
import '../widgets/ios_shift_card.dart';

class IOSShiftsScreen extends StatelessWidget {
  const IOSShiftsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      backgroundColor: CupertinoColors.systemGroupedBackground,
      child: CustomScrollView(
        slivers: [
          const CupertinoSliverNavigationBar(
            largeTitle: Text('Schichten'),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    "Übersicht",
                    style: TextStyle(
                      fontSize: 17,
                      color: CupertinoColors.systemGrey,
                    ),
                  ),
                  SizedBox(height: 12),
                  IOSShiftCard(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}