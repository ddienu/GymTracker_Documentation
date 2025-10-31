import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { UpdateProfessional } from '../model/dto/professional_update.dto';

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
export default class ProfessionalsFormComponent implements OnInit{
  professionalForm: FormGroup;
  editProfessionalForm: FormGroup;
  profileId: number = 0;
  isProfessionalFounded: boolean = false;
  professionalData : UpdateProfessional | null= null;
  @Input() isEditing: boolean = false;
  @Input() professionalId: number | null = null;
  @Output() onSuccess = new EventEmitter<void>();
  @Output() loadProfessionals = new EventEmitter<void>();
  @Output() closed = new EventEmitter<boolean>();

  constructor(
    private fb: FormBuilder,
    private professionalService: ProfessionalService,
    private router: Router
  ) {
    this.professionalForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      specialty: ['', Validators.required],
      certifications: [''],
      years_of_experience: [0, Validators.min(0)],
      is_available: [1, Validators.required],
      hourly_rate: [0, Validators.min(0)],
    });
    this.editProfessionalForm = this.fb.group({
      specialty: ['', Validators.required],
      certifications: ['', Validators.required],
      years_of_experience: [0, Validators.min(0)],
      hourly_rate: [0, Validators.min(0)],
      is_available: [1, Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      birth_date: ['', Validators.required],
      gender: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    if(this.professionalId){
      this.getProfessionalData();
    }
  }

  buscarPerfil() {
    const email = this.professionalForm.get('email')?.value;

    if (!email) {
      AlertUtil.toast('El campo de correo electrónico es requerido', 'info');
    }

    this.professionalService.getRoleByEmail(email).subscribe({
      next: (response) => {
        if (response.data) {
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
        }else{
          AlertUtil.toast("Correo electrónico no encontrado", "info");
        }
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

    //Se elimina el email
    delete payload.email;

    AlertUtil.confirm('¿Está seguro que desea continuar?').then((response) => {
      if (response.isConfirmed) {
        this.professionalService.createProfessional(email, payload).subscribe({
          next: (response) => {
            AlertUtil.toast('Profesional registrado con éxito', 'success').then(
              () => {
                this.onSuccess.emit();
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
    this.closed.emit(false);
  }

  updateProfessional() {
    AlertUtil.confirm("¿Desea guardar la información").then(
      (response) => {
        if(response.isConfirmed){
          if(this.editProfessionalForm.valid){
            this.professionalService.updateProfessionalAndProfile(this.professionalId!, this.editProfessionalForm.value).subscribe({
              next: (response) => {
                AlertUtil.toast("La información del profesional ha sido actualizada exitosamente.", "success").then(
                  () => {
                    this.closed.emit(false);
                    this.loadProfessionals.emit();
                  }
                )
              },
              error: (error) => {
                AlertUtil.toast("Error al actualizar el profesional", "error");
                console.error("Error updating professional data", error);
              }
            })
          }else{
            AlertUtil.toast("Favor diligenciar el formulario correctamente", "info");
          }
        }
      }
    )
  }

  getProfessionalData(){
    this.professionalService.getProfessionalAndProfileData(this.professionalId!).subscribe({
      next: (response) => {
        this.professionalData = response.data;
        const dataFormattedDate = {
          ...this.professionalData,
          birth_date : new Date(response.data.birth_date).toISOString().split('T')[0]
        }
        this.editProfessionalForm.patchValue(dataFormattedDate);
      },
      error: (error)=>{
        console.error("Error retrieving professional's data", error);
      }
    })
  }
}
