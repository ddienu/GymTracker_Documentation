import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthModel } from '../../features/auth/model/auth.model';
import { Login } from '../../features/auth/model/login.model';
import { Observable } from 'rxjs';
import { RegisterModel, RegisterResponse } from '../../features/auth/model/register.model';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl+"/api/auth";
  // private apiUrl = "http://localhost:3000/api/auth";
  

  constructor(private http: HttpClient) { }

  login(loginPayload : Login) : Observable<AuthModel>{
    return this.http.post<AuthModel>(`${this.apiUrl}/login`, loginPayload);
  }

  register(registerPayload : RegisterModel) : Observable<RegisterResponse>{
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, registerPayload);
  }

  isAuthenticated() : boolean {
    return !!localStorage.getItem('token');
  }
}
