import { Component, OnInit } from '@angular/core';
import FooterComponent from '../footer/footer.component';
import NavbarComponent from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { JwtService } from '../../core/jwt/jwt.service';
import { Professional } from './model/professional.model';
import { ProfessionalService } from '../../core/Professional/professional.service';
import { Router } from '@angular/router';
import ProfessionalsFormComponent from './professionals-form/professionals-form.component';

@Component({
  selector: 'app-professionals',
  standalone: true,
  imports: [FooterComponent, NavbarComponent, CommonModule, ProfessionalsFormComponent],
  templateUrl: './professionals.component.html',
  styleUrl: './professionals.component.css',
})
export default class ProfessionalsComponent implements OnInit {
  role: string = '';
  professionals: Professional[] = [];
  specialtyLabels = {
    'TRAINING': 'Entrenador personal',
    'NUTRITION': 'Nutricionista',
    'PHYSIOTHERAPY': 'Fisioterapeuta',
  };

  specialtyDescriptions = {
    'TRAINING':
      'Especialista en entrenamiento de fuerza y acondicionamiento físico.',
    'NUTRITION':
      'Especialista en nutrición deportiva y planes alimenticios personalizados.',
    'PHYSIOTHERAPY':
      'Especialista en fisioterapia y rehabilitación física para la recuperación muscular y articular.',
  };

  isModalOpen : boolean = false;

  constructor(
    private jwtService: JwtService,
    private professionalService: ProfessionalService,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.role = this.jwtService.extractRoleFromToken();
    this.getProfessionals();
  }

  getProfessionals() {
    this.professionalService.getProfessionals().subscribe({
      next: (response) => {
        this.professionals = response;
      },
      error: (error) => {
        console.error('Error retrieving professionals', error);
      },
    });
  }

  addProfessional(){
    this.router.navigate(['add/professional']);
  }

  changeModalState(){
    this.isModalOpen = !this.isModalOpen;
  }
}
