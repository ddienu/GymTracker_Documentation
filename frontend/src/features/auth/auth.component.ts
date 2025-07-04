import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/Auth/auth.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Router, RouterModule } from '@angular/router';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export default class AuthComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isRegister = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    (this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    })),
      (this.registerForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: ['', Validators.required],
        birth_date: ['', Validators.required],
        gender: ['', Validators.required],
      }));
  }

  login() {
    const formValue = this.loginForm.value;
    return this.authService.login(formValue).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.toastr.success('Iniciando sesión...');
        // this.router.navigate(['/inicio']);
      },
      error: (error) => {
        console.error('Error en login', error);
        this.toastr.error('Credenciales incorrectas');
      },
    });
  }

  register() {
    const registerFormValue = this.registerForm.value;
    return this.authService.register(registerFormValue).subscribe({
      next: (response) => {
        this.toastr
          .success('Cuenta creada con éxito', 'Éxito', {
            timeOut: 3000,
          })
          .onHidden.subscribe(() => {
            console.log('Toast finished');
            window.location.reload();
          });
        console.log(response);
      },
      error: (error) => {
        console.error('Error en registro', error);
      },
    });
  }

  changeState() {
    if (!this.isRegister) {
      this.isRegister = true;
      this.registerForm.reset({
        gender: '',
      });
    } else {
      this.isRegister = false;
      this.loginForm.reset();
    }
  }
}
