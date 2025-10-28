import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Professional } from '../../features/professionals/model/professional.model';
import { Observable } from 'rxjs';
import { ProfessionalRequest } from '../../features/professionals/model/dto/professional_request.dto';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {

  apiUrl = "http://localhost:3000/api/professionals";

  constructor(private http : HttpClient) { }

  getProfessionals() : Observable<Professional[]>{
    return this.http.get<Professional[]>(`${this.apiUrl}`)
  };

  createProfessional(email : string, professionalPayload : ProfessionalRequest) : Observable<any>{
    const params = new HttpParams().set('email', email);
    
    return this.http.post<any>(`${this.apiUrl}/email`, professionalPayload, { params} );
  }

  getProfileByEmail(email : string) : Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/email/${email}`);
  }

  getRoleByEmail(email : string) : Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/role/${email}`);
  }

  
}
