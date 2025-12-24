import { Component, OnInit } from '@angular/core';
import NavbarComponent from '../navbar/navbar.component';
import FooterComponent from '../footer/footer.component';
import { ServiceModel, ServiceResponse } from './model/service.model';
import { ServicesService } from '../../core/Services/services.service';
import { CommonModule } from '@angular/common';
import { JwtService } from '../../core/jwt/jwt.service';
import { Router, RouterModule } from '@angular/router';
import { ServiceFormStateService } from '../../core/ServiceFormState/service-form-state.service';
import { AlertUtil } from '../../shared/alert.util';
import { CartService } from '../../core/Cart/cart.service';
import { RequestCartItem } from '../cart/dto/requestCartItem.dto';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, CommonModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export default class ServicesComponent implements OnInit {
  services: ServiceModel[] = [];
  role: string = '';
  clientId : number | null = null;

  constructor(
    private servicesService: ServicesService,
    private jwtService: JwtService,
    private router: Router,
    private formStateService: ServiceFormStateService,
    private cartService : CartService
  ) {}

  ngOnInit(): void {
    this.getAllServices();
    this.role = this.jwtService.extractRoleFromToken();
    this.clientId = this.jwtService.getProfileIdFromToken();
  }

  getAllServices() {
    return this.servicesService.getServices().subscribe({
      next: (response) => {
        this.services = response;
      },
      error: (error) => {
        console.error('Error obteniendo los servicios', error);
      },
      complete: () => {
        console.log('Carga de servicios finalizada');
      },
    });
  }

  removeService(serviceId: number) {
    AlertUtil.confirm('¿Está seguro que desea eliminar el servicio?').then(
      (response) => {
        if (response.isConfirmed) {
          this.servicesService.deleteService(serviceId).subscribe({
            next: (response) => {
              AlertUtil.toast('Servicio eliminado correctamente', "success").then(() => {
                this.getAllServices();
              });
            },
            error: (error) => {
              AlertUtil.toast(error.error.message, 'error');
              console.error(error);
            },
            complete: () => {
              console.log('Eliminación del servicio finalizada');
            },
          });
        }
      }
    );
  }

  deactivateService(serviceId: number) {
    AlertUtil.confirm('¿Desea desactivar el servicio?').then((response) => {
      if (response.isConfirmed) {
        this.servicesService.deactivateService(serviceId).subscribe({
          next: (response) => {
            AlertUtil.toast(
              'El servicio ha sido desactivado correctamente',
              'success'
            ).then(() => {
              this.getAllServices();
            });
          },
          error: (error) => {
            AlertUtil.error(error.error.message);
            console.error('Error al desactivar el servicio', error);
          },
          complete: () => {
            console.log('Desactivación de servicio finalizada');
          },
        });
      }
    });
  }

  goToEdit(serviceId: number) {
    this.formStateService.setEditMode(true);
    // this.formStateService.setServiceIdToEdit(serviceId);
    this.router.navigate([`/services/edit/${serviceId}`]);
  }

  goToAdd() {
    this.formStateService.setEditMode(false);
    this.router.navigate([`/services/add`]);
  }

  addServiceToCart(itemType:string, itemId:number, quantity:number){
    const itemPayload : RequestCartItem = {
      itemId: itemId,
      itemType: itemType,
      quantity: quantity
    };

    AlertUtil.confirm("¿Desea agregar el servicio al carrito?").then(
      (response) => {
        if(response.isConfirmed){
          this.cartService.addItemToCart(this.clientId!, itemPayload).subscribe({
            next : (response) => {
              console.log(response);
              AlertUtil.toast("Servicio agregado al carrito exitosamente", "success");
            },
            error: (error) => {
              console.log(error);
              AlertUtil.toast("Error agregando servicio al carrito", "error");
            }
          })
        }
      }
    )
  }
}
