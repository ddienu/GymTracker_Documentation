import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import NavbarComponent from '../../navbar/navbar.component';
import FooterComponent from '../../footer/footer.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServicesService } from '../../../core/Services/services.service';
import { ServiceFormStateService } from '../../../core/ServiceFormState/service-form-state.service';
import { ServiceModel } from '../model/service.model';
import { AlertUtil } from '../../../shared/alert.util';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.css',
})
export default class ServiceFormComponent implements OnInit {
  serviceForm: FormGroup;
  editServiceForm: FormGroup;
  isEditting: boolean = false;
  serviceId: number = 0;
  serviceFounded!: ServiceModel;

  constructor(
    private fb: FormBuilder,
    private servicesService: ServicesService,
    private router: Router,
    private serviceFormState: ServiceFormStateService,
    private route: ActivatedRoute
  ) {
    (this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      service_type: ['', Validators.required],
      duration_days: ['', Validators.required],
      requires_appointment: [false],
    })),
      (this.editServiceForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        service_type: ['', Validators.required],
        duration_days: ['', Validators.required],
        requires_appointment: [false],
      }));
  }
  ngOnInit(): void {
    this.serviceId = +this.route.snapshot.paramMap.get('serviceId')!;
    if (this.serviceId !== 0) {
      this.loadServiceInformation();
    }
    this.serviceFormState.isEditting$.subscribe((isEdit) => {
      this.isEditting = isEdit;
    });
  }

  addService() {
    const formValue = this.serviceForm.value;
    this.serviceFormState.setEditMode(false);
    if (this.serviceForm.valid) {
      AlertUtil.confirm('¿Desea agregar el nuevo servicio?').then(
        (response) => {
          if (response.isConfirmed) {
            this.servicesService.addNewService(formValue).subscribe({
              next: (response) => {
                AlertUtil.toast(
                  'Servicio agregado exitosamente',
                  'success'
                ).then(() => {
                  this.router.navigate(['/services']);
                });
              },
              error: (error) => {
                AlertUtil.error(error.error.message);
                console.error('Error agregando nuevo servicio', error);
              },
            });
          }
        }
      );
    } else {
      AlertUtil.toast('Faltan campos por diligenciar, favor validar', 'error');
    }
  }

  editService() {
    const serviceToUpdatePayload = this.editServiceForm.value;
    if (this.editServiceForm.valid) {
      AlertUtil.confirm('¿Desear guardar la información suministrada?').then(
        (response) => {
          if (response.isConfirmed) {
            this.servicesService
              .updateService(this.serviceId, serviceToUpdatePayload)
              .subscribe({
                next: (response) => {
                  AlertUtil.toast(
                    'Servicio actualizado satisfactoriamente', "success"
                  ).then(() => {
                    this.router.navigate(['/services']);
                  });
                },
                error: (error) => {
                  AlertUtil.toast(error.error.message, "error");
                  console.error(error);
                },
              });
          }
        }
      );
    } else {
      AlertUtil.toast('Faltan campos por diligenciar, favor validar', 'error');
    }
  }

  loadServiceInformation() {
    this.servicesService.getServiceById(this.serviceId).subscribe({
      next: (response) => {
        this.serviceFounded = response;
        this.editServiceForm.patchValue({
          name: this.serviceFounded.name,
          description: this.serviceFounded.description,
          price: this.serviceFounded.price,
          service_type: this.serviceFounded.service_type,
          duration_days: this.serviceFounded.duration_days,
          requires_appointment: this.serviceFounded.requires_appointment,
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
