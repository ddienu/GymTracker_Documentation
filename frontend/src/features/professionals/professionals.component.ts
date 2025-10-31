import { Component, OnInit } from '@angular/core';
import FooterComponent from '../footer/footer.component';
import NavbarComponent from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { JwtService } from '../../core/jwt/jwt.service';
import { Professional } from './model/professional.model';
import { ProfessionalService } from '../../core/Professional/professional.service';
import { Router } from '@angular/router';
import ProfessionalsFormComponent from './professionals-form/professionals-form.component';
import { AlertUtil } from '../../shared/alert.util';
import { NonNullableFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-professionals',
  standalone: true,
  imports: [
    FooterComponent,
    NavbarComponent,
    CommonModule,
    ProfessionalsFormComponent,
  ],
  templateUrl: './professionals.component.html',
  styleUrl: './professionals.component.css',
})
export default class ProfessionalsComponent implements OnInit {
  role: string = '';
  professionals: Professional[] = [];
  isEditMode: boolean = false;
  professionalId: number | null = null;
  specialtyLabels = {
    TRAINING: 'Entrenador personal',
    NUTRITION: 'Nutricionista',
    PHYSIOTHERAPY: 'Fisioterapeuta',
  };

  specialtyDescriptions = {
    TRAINING:
      'Especialista en entrenamiento de fuerza y acondicionamiento físico.',
    NUTRITION:
      'Especialista en nutrición deportiva y planes alimenticios personalizados.',
    PHYSIOTHERAPY:
      'Especialista en fisioterapia y rehabilitación física para la recuperación muscular y articular.',
  };

  isModalOpen: boolean = false;

  constructor(
    private jwtService: JwtService,
    private professionalService: ProfessionalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.role = this.jwtService.extractRoleFromToken();
    this.getProfessionals();
  }

  getProfessionals() {
    this.professionalService.getProfessionals().subscribe({
      next: (response) => {
        this.professionals = response;
        console.log(response);
      },
      error: (error) => {
        console.error('Error retrieving professionals', error);
      },
    });
  }

  addProfessional() {
    this.router.navigate(['add/professional']);
  }

  deleteProfessional(professionalId: number) {
    AlertUtil.confirm('¿Está seguro que desea eliminar al profesional?').then(
      (result) => {
        if (result.isConfirmed) {
          this.professionalService
            .deleteProfessional(professionalId)
            .subscribe({
              next: () => {
                AlertUtil.toast(
                  'El profesional ha sido eliminado exitosamente',
                  'success'
                ).then(() => {
                  this.getProfessionals();
                });
              },
              error: (error) => {
                if (error.error.status === 404) {
                  AlertUtil.toast(
                    'Perfil del profesional no encontrado',
                    'error'
                  );
                }
                AlertUtil.toast('Error al eliminar el profesional', 'error');
              },
            });
        }
      }
    );
  }

  editProfessional(professionalId: number) {
    AlertUtil.confirm('¿Desea editar la información del profesional?').then(
      (response) => {
        if (response.isConfirmed) {
          this.isEditMode = true;
          this.professionalId = professionalId;
          this.isModalOpen = true;
        }
      }
    );
  }

  changeModalState() {
    this.isModalOpen = !this.isModalOpen;
    this.isEditMode = false;
    this.professionalId = null;
  }

  handleSuccess() {
    this.changeModalState(); // Cierra modal
    this.getProfessionals(); // Reload de la tabla o lista
  }
}
