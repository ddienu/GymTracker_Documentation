import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Professional } from '../../features/professionals/model/professional.model';
import { Observable } from 'rxjs';
import { ProfessionalRequest } from '../../features/professionals/model/dto/professional_request.dto';
import { UpdateProfessional } from '../../features/professionals/model/dto/professional_update.dto';
import { ProfessionalAvailability } from '../../features/professionals/model/dto/professional_availability.dto';
import { ProfessionalAppointment } from '../../features/professionals/model/dto/professional_appointment.dto';

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {

  apiUrl = "http://localhost:3000/api/professionals";

  constructor(private http : HttpClient) { }

  getProfessionals() : Observable<Professional[]>{
    return this.http.get<Professional[]>(`${this.apiUrl}`)
  };

  deleteProfessional(professionalId : number) : Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/${professionalId}`);
  }

  createProfessional(email : string, professionalPayload : ProfessionalRequest) : Observable<any>{
    const params = new HttpParams().set('email', email);
    
    return this.http.post<any>(`${this.apiUrl}/email`, professionalPayload, { params} );
  }

  updateProfessionalAndProfile(professionalId : number, professionalPayload : UpdateProfessional) : Observable<{message : string}>{
    return this.http.put<{message: string}>(`${this.apiUrl}/${professionalId}`, professionalPayload);
  }

  getProfileByEmail(email : string) : Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/email/${email}`);
  }

  getRoleByEmail(email : string) : Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/role/${email}`);
  }

  getProfessionalAndProfileData(professionalId : number) : Observable<{data : UpdateProfessional}>{
    return this.http.get<{data : UpdateProfessional}>(`${this.apiUrl}/edit/${professionalId}`);
  }

  getProfessionalAvailabity(professionalId : number, date : string) : Observable<{data : ProfessionalAvailability[]}>{
    const params = new HttpParams().set('date', date);

    return this.http.get<{data : ProfessionalAvailability[]}>(`${this.apiUrl}/${professionalId}/availability`, {params});
  }

  getProfessionalAppointments(professionalId : number, date : string) : Observable<{data : ProfessionalAppointment[]}>{
    const params = new HttpParams().set('date', date);
    return this.http.get<{data : ProfessionalAppointment[]}>(`${this.apiUrl}/appointments/${professionalId}`, {params});
  }

  
}
