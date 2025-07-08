import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import NavbarComponent from '../../navbar/navbar.component';
import FooterComponent from '../../footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ServicesService } from '../../../core/Services/services.service';
import { ToastrService } from 'ngx-toastr';
import { ServiceFormStateService } from '../../../core/ServiceFormState/service-form-state.service';
import { ServiceModel } from '../model/service.model';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, ReactiveFormsModule, RouterModule],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.css'
})
export default class ServiceFormComponent implements OnInit{

  serviceForm : FormGroup;
  editServiceForm : FormGroup;
  isEditting : boolean = false;
  serviceId : number = 0;
  serviceFounded! : ServiceModel;

  constructor(
    private fb : FormBuilder, 
    private servicesService : ServicesService, 
    private toastr: ToastrService, 
    private router: Router,
    private serviceFormState : ServiceFormStateService,
    private route: ActivatedRoute){
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      service_type: ['', Validators.required],
      duration_days: ['', Validators.required],
      is_active: ['', Validators.required]
    }),
    this.editServiceForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      service_type: ['', Validators.required],
      duration_days: ['', Validators.required],
      is_active: ['', Validators.required]
    })
  }
  ngOnInit(): void {
    this.serviceId = +this.route.snapshot.paramMap.get('serviceId')!;
    if(this.serviceId !== 0){
      this.loadServiceInformation();
    }
    this.serviceFormState.isEditting$.subscribe( isEdit => {
      this.isEditting = isEdit;
    })
    // this.
  }

  addService(){
    const formValue = this.serviceForm.value;
    this.serviceFormState.setEditMode(false);
    this.servicesService.addNewService(formValue).subscribe({
      next: (response) => {
        this.toastr.success('Servicio agregado exitosamente', '', {
          timeOut: 2000
        }).onHidden.subscribe( () => {
          this.router.navigate(['/services']);
        })
      },
      error: (error) => {
        this.toastr.error('Error agregando nuevo servicio');
        console.error("Error agregando nuevo servicio", error)
      },
      complete: () => {
        console.log("Agregar servicio finalizado");
      }
    })
  }

  editService(){
    const serviceToUpdatePayload = this.editServiceForm.value;
    console.log(serviceToUpdatePayload);
    this.servicesService.updateService(this.serviceId, serviceToUpdatePayload).subscribe({
      next: (response) => {
        this.toastr.success('Servicio actualizado satisfactoriamente', '', {
          timeOut: 2000
        }).onHidden.subscribe( () => {
          this.router.navigate(['/services']);
        })
      },
      error: (error) => {
        this.toastr.error(error.error.message);
        console.error(error);
      }
    })
  }

  loadServiceInformation(){
    this.servicesService.getServiceById(this.serviceId).subscribe({
      next: (response) => {
        this.serviceFounded = response;
        this.editServiceForm.patchValue({
          name: this.serviceFounded.name,
          description: this.serviceFounded.description,
          price: this.serviceFounded.price,
          service_type: this.serviceFounded.service_type,
          duration_days: this.serviceFounded.duration_days,
          is_active: this.serviceFounded.is_active
        })
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

}
