import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class CardItem extends StatelessWidget {
  final Color containerColor;
  final Widget cardWidget;
  final String cardTitle;
  final String cardSubtitle;
  final VoidCallback onTap;

  const CardItem({
    super.key,
    required this.containerColor,
    required this.cardWidget,
    required this.cardTitle,
    required this.cardSubtitle, 
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      color: Colors.grey.shade200,
      margin: const EdgeInsets.only(left: 20, right: 20, bottom: 10),
      elevation: 4.0,
      child: InkWell(
        onTap: onTap, // 🔥 Needed to make it tappable
        borderRadius: BorderRadius.circular(12),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              margin: const EdgeInsets.all(12),
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(12),
                color: containerColor,
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(18),
                child: cardWidget,
              ),
            ),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    cardTitle,
                    style: GoogleFonts.workSans(
                      fontSize: 18,
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.start,
                  ),
                  Text(
                    cardSubtitle,
                    softWrap: true,
                    overflow: TextOverflow.visible,
                    maxLines: 3,
                    style: GoogleFonts.workSans(
                      fontSize: 14,
                      color: Colors.grey.shade600,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}


/*Codigo con el que solo la flecha tiene la funcionalidad*/
// import 'package:flutter/material.dart';
// import 'package:google_fonts/google_fonts.dart';

// class CardItem extends StatelessWidget {
//   final Color containerColor;
//   final Widget cardWidget;
//   final String cardTitle;
//   final String cardSubtitle;
//   final VoidCallback onTap;

//   const CardItem({
//     super.key,
//     required this.containerColor,
//     required this.cardWidget,
//     required this.cardTitle,
//     required this.cardSubtitle, 
//     required this.onTap,
//   });

//   @override
//   Widget build(BuildContext context) {
//     return InkWell(
//       child: Card(
//         color: Colors.grey.shade200,
//         margin: EdgeInsets.only(left: 20, right: 20, bottom: 10),
//         elevation: 4.0,
//         child: Row(
//           mainAxisAlignment: MainAxisAlignment.spaceBetween,
//           children: [
//             Container(
//               padding: EdgeInsets.all(12),
//               margin: EdgeInsets.all(12),
//               width: 60,
//               height: 60,
//               decoration: BoxDecoration(
//                 borderRadius: BorderRadius.circular(12),
//                 color: containerColor,
//               ),
//               child: ClipRRect(
//                 borderRadius: BorderRadius.circular(18),
//                 child: cardWidget,
//               ),
//             ),
//             Expanded(
//               child: Column(
//                 crossAxisAlignment: CrossAxisAlignment.start,
//                 children: [
//                   Text(
//                     cardTitle,
//                     style: GoogleFonts.workSans(
//                       fontSize: 18,
//                       color: Colors.black,
//                       fontWeight: FontWeight.bold,
//                     ),
//                     textAlign: TextAlign.start,
//                   ),
//                   Text(
//                     cardSubtitle,
//                     softWrap: true,
//                     overflow: TextOverflow.visible,
//                     maxLines: 3,
//                     style: GoogleFonts.workSans(
//                       fontSize: 14,
//                       color: Colors.grey.shade600,
//                       fontWeight: FontWeight.w500,
//                     ),
//                   ),
//                 ],
//               ),
//             ),
//             IconButton(icon: Icon(Icons.arrow_forward), onPressed: onTap),
//           ],
//         ),
//       ),
//     );
//   }
// }
