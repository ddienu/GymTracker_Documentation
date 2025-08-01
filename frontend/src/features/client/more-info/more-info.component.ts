import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../core/Client/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import FooterComponent from '../../footer/footer.component';
import NavbarComponent from '../../navbar/navbar.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthStateService } from '../../../core/Auth-state/auth-state.service';


@Component({
  selector: 'app-more-info',
  standalone: true,
  imports: [FooterComponent, NavbarComponent, CommonModule],
  providers: [DatePipe],
  templateUrl: './more-info.component.html',
  styleUrl: './more-info.component.css'
})
export default class MoreInfoComponent implements OnInit{

  clientFounded : any;
  clientId! : number;
  formattedRegistrationDate : any;

  constructor(
    private clientService : ClientService, 
    private route : ActivatedRoute, 
    private datePipe : DatePipe, 
    private toastr : ToastrService, 
    private router: Router,
    private authStateService : AuthStateService){}

  ngOnInit(): void {
    this.clientId = +this.route.snapshot.paramMap.get('id')!;
    if(this.clientId){
      
    }
    this.getClientInfo(this.clientId);  
  }


  getClientInfo(clientId : number){
    this.clientService.getClientById(clientId).subscribe(
      (response: any) => {
        this.clientFounded = response;
        this.formattedRegistrationDate = this.datePipe.transform(this.clientFounded.client.registration_date, 'dd/MM/yyyy HH:mm');
        // console.log(this.formattedRegistrationDate);
        // console.log(response);
      } 
    )
  }

  deleteClient(){
    const deleteClientDecition = window.confirm("¿Está seguro que desea eliminar el cliente?");
    if(deleteClientDecition){
      this.clientService.deleteClient(this.clientId).subscribe(
        (response) => {
          this.toastr.success('Cliente eliminado correctamente','',{
            timeOut:2500
          })
          .onHidden.subscribe(() => {
            this.router.navigate(['/client'])
          }
          )
        }
      )
    }
  }

  updateClientStatus(){
    const updateStatusDecition = window.confirm("¿Está seguro que desea desactivar el cliente?");
    if(updateStatusDecition){
      this.clientService.softDelete(this.clientId).subscribe(
        () => {
            this.toastr.success('Cliente actualizado correctamente','',{
            timeOut:2500
          })
          .onHidden.subscribe(() => {
            window.location.reload();
          }
          )
        }
      )
    }
  }

  goToEditForm(){
    this.authStateService.setEditMode(true);
    this.authStateService.setClientId(this.clientId);
    this.authStateService.setRegisterMode(true, "");
    this.router.navigate(['/auth'])
  }
}
