import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/Auth/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { JwtService } from '../../core/jwt/jwt.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export default class NavbarComponent implements OnInit{

  isAuthenticated = false;
  userLogged? = "";

  constructor(private authService : AuthService,  private toastr : ToastrService, private router: Router, private route : ActivatedRoute, private jwtService : JwtService){}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userLogged = this.jwtService.extractUsernameFromToken();
  }

  logout(){
    const logoutDecition = window.confirm("¿Está seguro que desea cerrar sesión?")
    if(logoutDecition){
      localStorage.removeItem('token');
      this.toastr.info('Cerrando sesión...','', {
        timeOut: 2500
      })
      .onHidden.subscribe(() => {
        this.route.url.forEach( (ruta) => {
          ruta.forEach(elemento => {
            if(!elemento.path.startsWith('/')){
              this.router.navigate(['/']);
            }else{
              window.location.reload();
            }
          })
        });
      })
    }
  }



}
