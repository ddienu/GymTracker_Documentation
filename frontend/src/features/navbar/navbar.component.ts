import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/Auth/auth.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { JwtService } from '../../core/jwt/jwt.service';
import { AlertUtil } from '../../shared/alert.util';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export default class NavbarComponent implements OnInit {
  isAuthenticated = false;
  userLogged? = '';
  menuOpen: boolean = false;
  role : string | null = null;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private jwtService: JwtService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.userLogged = this.jwtService.extractUsernameFromToken();
    this.role = this.jwtService.extractRoleFromToken();
  }

  logout() {
    AlertUtil.confirm('¿Deseas cerrar sesión?').then((response) => {
      if (response.isConfirmed) {
        localStorage.removeItem('token');
        AlertUtil.toast('Cerrando sesión...', 'success').then(() => {
          if (this.router.url === '/') {
            this.router
              .navigateByUrl('/auth', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/']);
              });
          } else {
            this.router.navigate(['/']);
          }
        });
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    console.log(this.menuOpen);
  }

  closeMenu() {
    this.menuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('.user-menu');
    if (!clickedInside) {
      this.menuOpen = false;
    }
  }
}
