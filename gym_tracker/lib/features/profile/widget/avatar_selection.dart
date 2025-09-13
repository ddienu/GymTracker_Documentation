import 'package:flutter/material.dart';

class AvatarSelector extends StatefulWidget {
  const AvatarSelector({super.key});

  @override
  State<AvatarSelector> createState() => _AvatarSelectorState();
}

class _AvatarSelectorState extends State<AvatarSelector> {
  final List<String> avatars = [
    "gender/female_gender.png",
    "gender/male_gender.png",
    "assets/avatars/avatar3.png",
    "assets/avatars/avatar3.png",
    "assets/avatars/avatar3.png",
    "assets/avatars/avatar3.png",
  ];

  int selectedIndex = 0; // el que está seleccionado

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 200,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: avatars.length,
        separatorBuilder: (context, index) => const SizedBox(width: 16),
        itemBuilder: (context, index) {
          final isSelected = index == selectedIndex;

          return GestureDetector(
            onTap: () {
              setState(() {
                selectedIndex = index;
              });
            },
            child: Container(
              width: 200,
              height: 200,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: isSelected
                    ? Border.all(color: Colors.orange, width: 7)
                    : null,
              ),
              child: CircleAvatar(
                radius: 50,
                backgroundImage: AssetImage(avatars[index]),
              ),
            ),
          );
        },
      ),
    );
  }
}
