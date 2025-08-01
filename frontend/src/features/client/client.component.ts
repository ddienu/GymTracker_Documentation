import { Component, OnInit } from '@angular/core';
import NavbarComponent from '../navbar/navbar.component';
import FooterComponent from '../footer/footer.component';
import { ClientService } from '../../core/Client/client.service';
import { CommonModule } from '@angular/common';
import AuthComponent from '../auth/auth.component';
import { Router, RouterModule } from '@angular/router';
import { AuthStateService } from '../../core/Auth-state/auth-state.service';

@Component({
  selector: 'app-client',
  standalone: true,
  templateUrl: './client.component.html',
  imports: [NavbarComponent, FooterComponent, CommonModule, AuthComponent, RouterModule],
  styleUrl: './client.component.css'
})
export default class ClientComponent implements OnInit{

  clients : any = [];

  constructor(private clientService : ClientService, private authStateService : AuthStateService, private router : Router){}


  ngOnInit(): void {
    this.getClients();
  }

  getClients(){
    this.clientService.getClients().subscribe(
     (response) => {
      this.clients = response;
      console.log(this.clients.client);
     } 
    )
  }

  goToRegister(){
    this.authStateService.setRegisterMode(true, "admin");
    this.router.navigate(['/auth'])
  }

}
