import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthModel } from '../../features/auth/model/auth.model';
import { Login } from '../../features/auth/model/login.model';
import { Observable } from 'rxjs';
import { RegisterModel } from '../../features/auth/model/register.model';
import { RegisterResponse } from '../../features/auth/model/registerResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "http://localhost:3000/api/auth";

  constructor(private http: HttpClient) { }

  login(loginPayload : Login) : Observable<AuthModel>{
    return this.http.post<AuthModel>(`${this.apiUrl}/login`, loginPayload);
  }

  register(registerPayload : RegisterModel) : Observable<RegisterResponse>{
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, registerPayload);
  }

}
