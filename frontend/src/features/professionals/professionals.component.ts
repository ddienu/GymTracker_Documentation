import { Component } from '@angular/core';
import FooterComponent from '../footer/footer.component';
import NavbarComponent from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-professionals',
  standalone: true,
  imports: [FooterComponent, NavbarComponent, CommonModule],
  templateUrl: './professionals.component.html',
  styleUrl: './professionals.component.css'
})
export default class ProfessionalsComponent {

}
