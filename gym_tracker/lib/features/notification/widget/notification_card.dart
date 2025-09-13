import 'package:flutter/material.dart';

class NotificationCard extends StatelessWidget {
  final VoidCallback onTap;
  final String date;
  final String title;
  final String subtitle;
  final String imagePath;
  final Color fontColor;

  const NotificationCard({
    super.key,
    required this.onTap,
    required this.date,
    required this.title,
    required this.subtitle,
    required this.imagePath,
    required this.fontColor,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 3.0,
      margin: const EdgeInsets.only(bottom: 30),
      child: InkWell(
        onTap: onTap,
        child: Container(
          width: MediaQuery.of(context).size.width * 0.8,
          height: MediaQuery.of(context).size.width * 0.34,
          decoration: BoxDecoration(borderRadius: BorderRadius.circular(22)),
          child: Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadiusGeometry.circular(10),
                child: SizedBox(
                  height: double.infinity,
                  width: double.infinity,
                  child: Opacity(
                    opacity: 0.9,
                    child: Image(image: AssetImage(imagePath), fit: BoxFit.cover),
                  ),
                ),
              ),
              Positioned(
                top: 12,
                left: 12,
                child: Text(
                  date,
                  style: TextStyle(
                    color: fontColor,
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              Positioned(
                bottom: 10,
                left: 12,
                right: 12,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        color: fontColor,
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    SizedBox(height: 6),
                    Text(
                      subtitle,
                      style: TextStyle(color: fontColor, fontSize: 14),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      softWrap: true,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
