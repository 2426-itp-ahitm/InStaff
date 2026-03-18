import 'package:flutter/cupertino.dart';

class IOSShiftCard extends StatelessWidget {
  const IOSShiftCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: CupertinoColors.white,
        borderRadius: BorderRadius.circular(12),
      ),
      padding: const EdgeInsets.all(16),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Service",
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          SizedBox(height: 4),
          Text(
            "18:00 - 23:00",
            style: TextStyle(
              color: CupertinoColors.systemGrey,
            ),
          ),
        ],
      ),
    );
  }
}