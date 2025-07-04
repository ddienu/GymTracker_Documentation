import { Component } from '@angular/core';
import { AuthService } from '../../core/Auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from 'express';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export default class AuthComponent {

  loginForm : FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
    // private router: Router
  ){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required] 
    })
  }

  login(){
    console.log(this.loginForm.value);
  }

}
