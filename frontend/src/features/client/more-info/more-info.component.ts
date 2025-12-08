import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../core/Client/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import FooterComponent from '../../footer/footer.component';
import NavbarComponent from '../../navbar/navbar.component';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthStateService } from '../../../core/Auth-state/auth-state.service';
import { AlertUtil } from '../../../shared/alert.util';
import { MeasuresChartComponent } from '../../measures-chart/measures-chart.component';
import { PaymentService } from '../../../core/Payment/payment.service';


@Component({
  selector: 'app-more-info',
  standalone: true,
  imports: [FooterComponent, NavbarComponent, CommonModule, MeasuresChartComponent],
  providers: [DatePipe],
  templateUrl: './more-info.component.html',
  styleUrl: './more-info.component.css'
})
export default class MoreInfoComponent implements OnInit{

  clientFounded : any;
  clientId! : number;
  userId : number | null = null;
  formattedRegistrationDate : any;

  constructor(
    private clientService : ClientService, 
    private route : ActivatedRoute, 
    private datePipe : DatePipe, 
    private router: Router,
    private authStateService : AuthStateService,
    private paymentService : PaymentService  
  ){}

  ngOnInit(): void {
    this.clientId = +this.route.snapshot.paramMap.get('id')!;
    if(this.clientId){
      this.getClientInfo(this.clientId);  
    }
  }


  getClientInfo(clientId : number){
    this.clientService.getClientById(clientId).subscribe(
      (response: any) => {
        this.clientFounded = response.client;
        this.userId = response.client.user_id;
        this.formattedRegistrationDate = this.datePipe.transform(this.clientFounded.registration_date, 'dd/MM/yyyy HH:mm');
      } 
    )
  }

  deleteClient(){
    AlertUtil.confirm("¿Desea eliminar el usuario completamente?").then(
      (response) => {
        if(response.isConfirmed){
          this.clientService.deleteClient(this.clientId).subscribe({
            next: () => {
              AlertUtil.toast("Cliente eliminado satisfactoriamente", "success").then(
                () => {
                  this.router.navigate(['/client'])          
                }
              )
            },
            error: (error) => {
              AlertUtil.error("Error eliminando al cliente");
              console.error("Error erasing client", error);
            }
          })
        }
      }
    )
  }

  updateClientStatus(){
    AlertUtil.confirm("¿Está seguro que desea desactivar el cliente?").then(
      (response) => {
        if(response.isConfirmed){
          this.clientService.softDelete(this.clientId).subscribe({
            next: () => {
              AlertUtil.toast("Cliente desactivado satisfactoriamente", "success").then(
                () => {
                  this.getClientInfo(this.clientId);
                }
              )
            },
            error: (error) => {
              AlertUtil.error("Error al desactivar el cliente");
              console.error("Error deactivating client", error);
            }
          })
        }
      }
    )
  }

  goToEditForm(){
    AlertUtil.confirm("¿Desea editar la información del cliente?").then(
      (response) => {
        if(response.isConfirmed){
          this.authStateService.setEditMode(true);
          this.authStateService.setClientId(this.clientId);
          this.authStateService.setRegisterMode(true, "");
          this.router.navigate(['/auth']);
        }
      }
    )
  }

  reactivateUser(userId : number){
    AlertUtil.confirm("¿Desea reactivar al usuario seleccionado?").then(
      (response) => {
        if(response.isConfirmed){
          this.clientService.reactivateClient(userId).subscribe({
            next: (response) => {
              AlertUtil.toast("Cliente reactivado satisfactoriamente", "success").then(
                () => {
                 this.getClientInfo(this.clientId); 
                }
              )
            },
            error: (error) => {
              AlertUtil.toast(error.error.message, "error");
              console.error("Error reactivating user", error);
            }
          })
        }
      }
    )
  }

  goToClientPayments(clientId : number){
    this.paymentService.getPaymentsByClientId(clientId).subscribe({
      next: (response) => {
        const payments = response.data;

        if(payments.length === 0){
          AlertUtil.toast("El cliente no tiene pagos asignados");
          return;
        }
        this.router.navigate(['/client-payments', clientId]);
      },
      error: (error) => {
        AlertUtil.toast("No se pudo obtener el historial de pagos del cliente", "error");
      }
    })
  }
}
