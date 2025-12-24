import { Component } from '@angular/core';
import NavbarComponent from '../navbar/navbar.component';
import FooterComponent from '../footer/footer.component';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './appointment.component.html',
  styleUrl: './appointment.component.css'
})
export default class AppointmentComponent {

}
