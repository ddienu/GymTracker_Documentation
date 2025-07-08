import { Component, OnInit } from '@angular/core';
import NavbarComponent from '../navbar/navbar.component';
import FooterComponent from '../footer/footer.component';
import { ServiceModel, ServiceResponse } from './model/service.model';
import { ServicesService } from '../../core/Services/services.service';
import { CommonModule } from '@angular/common';
import { JwtService } from '../../core/jwt/jwt.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ServiceFormStateService } from '../../core/ServiceFormState/service-form-state.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export default class ServicesComponent implements OnInit{

  services : ServiceModel[] = [];
  role: string = "";

  constructor(
    private servicesService : ServicesService, 
    private jwtService : JwtService, 
    private toastr : ToastrService, 
    private router : Router,
    private formStateService : ServiceFormStateService){}

  ngOnInit(): void {
    this.getAllServices();
    this.role = this.jwtService.extractRoleFromToken();
    console.log(this.role);
  }

  getAllServices(){
    return this.servicesService.getServices().subscribe({
      next: (response) => {
        this.services = response;
      },
      error: (error) => {
        console.error("Error obteniendo los servicios", error);
      },
      complete: () => {
        console.log("Carga de servicios finalizada")
      }
    })
  }

  removeService(serviceId : number){
    const deleteDecition = window.confirm(`¿Está seguro de eliminar el servicio?`)
    if(deleteDecition){
      this.servicesService.deleteService(serviceId).subscribe({
        next: (response) => {
          this.toastr.success('Servicio eliminado correctamente', '', {
            timeOut: 2000
          }).onHidden.subscribe( () => {
            window.location.reload();
          })
        },
        error: (error) => {
          this.toastr.error('Error eliminando el servicio');          
          console.error(error);
        },
        complete: () => {
          console.log("Eliminación del servicio finalizada");
        }
      })
    }
  }

  deactivateService(serviceId:number){
    const deactivateDecition = window.confirm("¿Desea desactivar el servicio?");
    if(deactivateDecition){
      this.servicesService.deactivateService(serviceId).subscribe({
        next: (response) => {
          this.toastr.success('El servicio ha sido desactivado correctamente','', {
            timeOut: 2000
          }).onHidden.subscribe( () => {
            window.location.reload();
          })
        },
        error: (error) => {
          this.toastr.error(error.error.message);
          console.error("Error al desactivar el servicio",error);
        },
        complete: () => {
          console.log("Desactivación de servicio finalizada");
        }
      })
    }
  }

  goToEdit(serviceId:number){
    this.formStateService.setEditMode(true);
    // this.formStateService.setServiceIdToEdit(serviceId);
    this.router.navigate([`/services/edit/${serviceId}`]);
  }

  goToAdd(){
    this.formStateService.setEditMode(false);
    this.router.navigate([`/services/add`]);
  }

}
