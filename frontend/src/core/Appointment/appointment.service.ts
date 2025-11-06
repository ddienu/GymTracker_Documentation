import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  apiUrl = 'http://localhost:3000/api/appointments'

  constructor(private http : HttpClient) { }

  cancelAppointment(appointmentId : number) : Observable<{message : string}>{
    return this.http.patch<{message: string}>(`${this.apiUrl}/cancel/${appointmentId}`, {});
  }

  rescheduleAppointment(appointmentId : number, appointmentData : {start_time : string, end_time : string}) : Observable<{message : string}>{
    return this.http.put<{message : string}>(`${this.apiUrl}/${appointmentId}`, appointmentData);
  }
}
