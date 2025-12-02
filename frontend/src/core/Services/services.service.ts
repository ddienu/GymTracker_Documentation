import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ServiceModel, ServiceResponse } from '../../features/services/model/service.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  private apiUrl = environment.apiUrl+"/api/services";
  // private apiUrl = "http://localhost:3000/api/services"

  constructor(private http: HttpClient) { }
  
    addNewService(newServicePayload : ServiceModel) : Observable<ServiceModel>{
      const jwt = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization':`Bearer ${jwt}`
      });
      return this.http.post<ServiceModel>(`${this.apiUrl}`, newServicePayload, {headers});
    }

  getServices() : Observable<ServiceModel[]>{
    const jwt = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${jwt}`
    });
    return this.http.get<ServiceModel[]>(`${this.apiUrl}`, {headers});
  }

  getServiceById(serviceId:number): Observable<ServiceModel>{
    const jwt = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${jwt}`
    });
    return this.http.get<ServiceModel>(`${this.apiUrl}/${serviceId}`, {headers});
  }

  updateService(serviceId:number, serviceToUpdatePayload:ServiceModel) : Observable<ServiceModel>{
    const jwt = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${jwt}`
    });
    return this.http.put<ServiceModel>(`${this.apiUrl}/${serviceId}`,serviceToUpdatePayload,{headers});
  }

  deleteService(serviceId:number) : Observable<ServiceModel>{
    const jwt = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${jwt}`
    });
    return this.http.delete<ServiceModel>(`${this.apiUrl}/${serviceId}`,{headers});
  }

  deactivateService(serviceId:number): Observable<ServiceModel>{
    const jwt = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization':`Bearer ${jwt}`
    });
    return this.http.patch<ServiceModel>(`${this.apiUrl}/${serviceId}`,{}, {headers});
  }
}
