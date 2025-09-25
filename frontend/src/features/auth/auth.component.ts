import { Component, Input, OnInit } from '@angular/core';
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
import NavbarComponent from '../navbar/navbar.component';
import FooterComponent from '../footer/footer.component';
import { AuthStateService } from '../../core/Auth-state/auth-state.service';
import { ClientService } from '../../core/Client/client.service';
import { AlertUtil } from '../../shared/alert.util';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    NavbarComponent,
    FooterComponent,
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export default class AuthComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isRegister: boolean = false;
  registerFrom: string = '';
  editForm: boolean = false;
  clientId: number = 0;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private authStateService: AuthStateService,
    private clientService: ClientService
  ) {
    (this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    })),
      (this.registerForm = this.fb.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        document_number: ['', Validators.required],
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: ['', Validators.required],
        birth_date: ['', Validators.required],
        gender: ['', Validators.required],
      }));
  }
  ngOnInit(): void {
    this.authStateService.registerMode$.subscribe((value) => {
      this.isRegister = value;
    });
    this.authStateService.registerFrom$.subscribe((value) => {
      this.registerFrom = value;
    });
    this.authStateService.editMode$.subscribe((value) => {
      this.editForm = value;
    });
    this.authStateService.clientId$.subscribe((value) => {
      this.clientId = value;
    });
    this.authStateService.clientId$.subscribe((value) => {
      this.clientId = value;
      if (this.clientId !== 0 && this.editForm === true) {
        this.loadClientInfo(this.clientId);
      }
    });
  }

  login() {
    const formValue = this.loginForm.value;
    if (this.loginForm.valid) {
      return this.authService.login(formValue).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          this.toastr
            .success('Iniciando sesión...', '', {
              timeOut: 2500,
            })
            .onHidden.subscribe(() => {
              this.router.navigate(['']);
            });
        },
        error: (error) => {
          console.error('Error en login', error);
          this.toastr.error('Credenciales incorrectas');
        },
      });
    } else {
      return;
    }
  }

  register() {
    const registerFormValue = this.registerForm.value;
    return this.authService.register(registerFormValue).subscribe({
      next: (response) => {
        this.toastr
          .success('Cuenta creada con éxito', '', {
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

  registerFromAdmin() {
    const registerFormValue = this.registerForm.value;
    if (this.registerForm.valid) {
      AlertUtil.confirm('¿Desea guardar la información?').then(
        (response) => {
          if (response.isConfirmed) {
            this.authService.register(registerFormValue).subscribe({
              next: () => {
                AlertUtil.success("Cuenta creada con éxito").then(
                  () => {
                    this.authStateService.setClientId(0);
                    this.authStateService.setEditMode(false);
                    this.authStateService.setRegisterMode(false, '');
                    this.router.navigate(['/client']);
                  }
                )
              },
              error: (error) => {
                if(error.error.status === 409){
                  AlertUtil.error("Nombre de usuario o email ya existen");  
                  return;
                }
                AlertUtil.error("Error completando el registro, comuníquese con un administrador");
                console.error('Error en registro', error);
              },
            });
          }
        }
      );
    } else {
      AlertUtil.toast('Faltan campos por diligenciar');
    }
  }

  editClientForm() {
    const editFormValue = this.registerForm.getRawValue();
    if(this.registerForm.valid){
      AlertUtil.confirm('¿Desea actualizar la información?').then(
        (response) => {
          if(response.isConfirmed){
            const updatedClient = {
              ...editFormValue,
              password_hash: editFormValue.password,
            };
            delete updatedClient.password;
            this.clientService.updateClient(this.clientId, updatedClient).subscribe({
              next: (response) => {
                AlertUtil.toast("Cliente actualizado con éxito", "success").then(
                  () => {
                    this.authStateService.setClientId(0);
                    this.authStateService.setEditMode(false);
                    this.authStateService.setRegisterMode(false, '');
                    this.router.navigate(['/client']);
                  }
                )
              },
              error: (error)=> {
                AlertUtil.error("Error actualizando los datos, comuníquese con el administrador");
                console.error("Error en edicióin de cliente", error);
              }
            });
          }
        }
      )
    }else{
      AlertUtil.toast("Faltan campos por diligenciar", "info");
    }
  }

  loadClientInfo(clientId: number) {
    this.clientService.getClientById(clientId).subscribe({
      next: (response) => {
        const birthDateISO = response.client.birth_date;
        const birthDateFormatted = birthDateISO.split('T')[0];
        this.registerForm.patchValue({
          username: response.client.username,
          password: response.client.password_hash,
          document_number: response.client.document_number,
          first_name: response.client.first_name,
          last_name: response.client.last_name,
          email: response.client.email,
          birth_date: birthDateFormatted,
          gender: response.client.gender,
        });

        this.registerForm.get('password')?.disable();
      },
      error: (error) => {
        console.error('Error al obtener el cliente', error);
      },
    });
  }

  goBack() {
    this.router.navigate(['client']);
  }
}
