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
import { FormsModule, NonNullableFormBuilder } from '@angular/forms';
import { ProfessionalAvailability } from './model/dto/professional_availability.dto';
import { ProfessionalAppointment } from './model/dto/professional_appointment.dto';
import { AppointmentService } from '../../core/Appointment/appointment.service';

@Component({
  selector: 'app-professionals',
  standalone: true,
  imports: [
    FooterComponent,
    NavbarComponent,
    CommonModule,
    ProfessionalsFormComponent,
    FormsModule,
  ],
  templateUrl: './professionals.component.html',
  styleUrl: './professionals.component.css',
})
export default class ProfessionalsComponent implements OnInit {
  role: string = '';
  professionals: Professional[] = [];
  appointmentsAssigned : ProfessionalAppointment[] = [];
  isEditMode: boolean = false;
  professionalId: number | null = null;
  appointmentsLoaded : boolean = false;
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
  isModalAvailabityOpen: boolean = false;
  isModalAppointmentsOpen: boolean = false;
  isRescheduling : boolean = false;
  appointmentSelectedDate: string | null = null;
  selectedDate: string | null = null;
  appointmentId : number | null = null;
  clientId : number | null = null;
  availableAppointments: ProfessionalAvailability[] = [];

  constructor(
    private jwtService: JwtService,
    private professionalService: ProfessionalService,
    private AppointmentService : AppointmentService,
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

  closeProfessionalAvailabilityModal() {
    this.isModalAvailabityOpen = !this.isModalAvailabityOpen;
    this.selectedDate = null;
    this.availableAppointments = [];
  }

  professionalAvailability(professionalId: number) {
    this.isModalAvailabityOpen = true;
    if (this.selectedDate) {
      this.professionalService
        .getProfessionalAvailabity(professionalId, this.selectedDate)
        .subscribe({
          next: (response) => {
            this.availableAppointments = response.data;
          },
          error: (error) => {
            console.error('Error loading professional availabity', error);
          },
        });
    }
  }

  getProfessionalAppointments(professionalId: number) {
    this.isModalAppointmentsOpen = true;
    if (this.appointmentSelectedDate) {
      this.professionalService
        .getProfessionalAppointments(
          professionalId,
          this.appointmentSelectedDate!
        )
        .subscribe({
          next: (response) => {
            this.appointmentsAssigned = response.data;
            this.appointmentsLoaded = true;
            console.log(this.appointmentsAssigned);
          },
        });
    }
  }
  closeProfessionalAppointmentsModal() {
    this.isModalAppointmentsOpen = !this.isModalAppointmentsOpen;
    this.appointmentSelectedDate = null;
    this.appointmentsAssigned = [];
    this.appointmentsLoaded = false;
  }

  cancelAppointment(appointmentId : number){
    AlertUtil.confirm('¿Desea cancelar la cita seleccionada?').then(
      (response) => {
        if(response.isConfirmed){
          this.AppointmentService.cancelAppointment(appointmentId).subscribe({
            next: () => {
              AlertUtil.toast("La cita fue cancelada satisfactoriamente", "success").then(
                () => {
                  this.closeProfessionalAppointmentsModal();
                }
              )
            },
            error: (error) => {
              AlertUtil.toast("Error al cancelar la cita", "error");
            }
          })
        }
      }
    )
  }

  startRescheduleAppointment(appointmentId : number, clientId : number){
    AlertUtil.confirm('¿Desea reagendar la cita?').then(
      (response) => {
        if(response.isConfirmed){
          this.isRescheduling = true;
          this.closeProfessionalAppointmentsModal();
          this.isModalAvailabityOpen = true;
          this.appointmentId  = appointmentId;
        }
      }
    )
  }
  
  rescheduleAppointment(ap : any, selectedDate : string){
    const body = {
      start_time : `${selectedDate} ${ap.start}`,
      end_time : `${selectedDate} ${ap.end}`
    }

    AlertUtil.confirm("¿Desea reagendar la cita para esta fecha?").then(
      (response) => {
        if(response.isConfirmed){
          this.AppointmentService.rescheduleAppointment(this.appointmentId!, body).subscribe({
            next: (response) => {
              AlertUtil.toast("Cita reagendada exitosamente", "success").then(
                () => {
                  this.closeProfessionalAppointmentsModal();
                  this.closeProfessionalAvailabilityModal();
                  this.isModalAppointmentsOpen = false;
                  this.isModalAvailabityOpen = false;
                  this.appointmentId = null;
                }
              )
            },
            error: (error) => {
              AlertUtil.toast("Error al reagendar la cita", "error");
            }
          })
        }
      }
    )
  }
}
