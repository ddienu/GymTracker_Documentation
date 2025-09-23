// import 'package:flutter/gestures.dart';
// import 'package:flutter/material.dart';
// import 'package:google_fonts/google_fonts.dart';
// import 'package:gym_tracker/features/login/presentation/login.dart';

// class HaveAnAccountAlready extends StatelessWidget {
//   const HaveAnAccountAlready({super.key});

//   @override
//   Widget build(BuildContext context) {
//     return Column(
//       children: [
//         RichText(
//           text: TextSpan(
//             style: GoogleFonts.workSans(
//               fontSize: 16,
//               fontWeight: FontWeight.w500,
//               color: Colors.grey.shade700,
//             ),
//             children: [
//               TextSpan(text: "¿Ya tienes una cuenta? Ingresa "),
//               TextSpan(
//                 text: "aquí",
//                 style: GoogleFonts.workSans(
//                   color: Color(0xFFF97316),
//                   fontWeight: FontWeight.bold,
//                   decoration: TextDecoration.underline,
//                   fontSize: 16,
//                 ),
//                 recognizer: TapGestureRecognizer()
//                   ..onTap = () => Navigator.push(
//                     context,
//                     MaterialPageRoute(builder: (context) => Login()),
//                   ),
//               ),
//             ],
//           ),
//         ),
//       ],
//     );
//   }
// }
