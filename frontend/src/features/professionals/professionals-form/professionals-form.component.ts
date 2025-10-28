import { Component } from '@angular/core';
import NavbarComponent from '../../navbar/navbar.component';
import FooterComponent from '../../footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfessionalService } from '../../../core/Professional/professional.service';
import { AlertUtil } from '../../../shared/alert.util';

@Component({
  selector: 'app-professionals-form',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    RouterModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './professionals-form.component.html',
  styleUrl: './professionals-form.component.css',
})
export default class ProfessionalsFormComponent {
  professionalForm: FormGroup;
  profileId: number = 0;
  isProfessionalFounded: boolean = false;

  constructor(
    private fb: FormBuilder,
    private professionalService: ProfessionalService,
    private router : Router
  ) {
    this.professionalForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      specialty: ['', Validators.required],
      certifications: [''],
      years_of_experience: [0, Validators.min(0)],
      is_available: [1, Validators.required],
      hourly_rate: [0, Validators.min(0)],
    });
  }

  buscarPerfil() {
    const email = this.professionalForm.get('email')?.value;

    if (!email) {
      AlertUtil.toast('El campo de correo electrónico es requerido', 'info');
    }

    this.professionalService.getRoleByEmail(email).subscribe({
      next: (response) => {
        if (response.data.name === 'PROFESSIONAL') {
          AlertUtil.toast(
            'El perfil ya se encuentra registrado como profesional',
            'error'
          );
          return;
        }

        // ✅ Solo si NO es PROFESSIONAL hace la siguiente petición
        this.professionalService.getProfileByEmail(email).subscribe({
          next: (response) => {
            this.profileId = response.data.profile_id;
            console.log(this.profileId);
            this.isProfessionalFounded = true;
          },
          error: (error) => {
            if (error.status === 404) {
              AlertUtil.toast('Perfil no encontrado', 'error');
            }
          },
        });
      },

      error: (error) => console.error(error),
    });
  }

  createProfessional() {
    if (this.professionalForm.invalid) {
      AlertUtil.toast('Verifica los datos del formulario', 'error');
      return;
    }

    const email = this.professionalForm.get('email')?.value;

    // Copiamos todos los valores del form
    const payload = { ...this.professionalForm.value };

    // Eliminamos el email antes de enviar
    delete payload.email;

    AlertUtil.confirm('¿Está seguro que desea continuar?').then((response) => {
      if (response.isConfirmed) {
        this.professionalService.createProfessional(email, payload).subscribe({
          next: (response) => {
            AlertUtil.toast('Profesional registrado con éxito', 'success').then(
              () =>{
                this.router.navigate(['/professionals']);
              }
            );
          },
          error: (error) => {
            console.error(error);
            AlertUtil.toast('Error guardando el profesional', 'error');
          },
        });
      }
    });
  }

  cancelar() {
    this.professionalForm.reset();
  }
}
