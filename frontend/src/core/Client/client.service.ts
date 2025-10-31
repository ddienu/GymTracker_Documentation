import { NumberSymbol } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientModel, ClientResponse } from '../../features/client/model/client.model';
import { Observable } from 'rxjs';
import { UserResponse } from '../../features/auth/model/user.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  // http://localhost:3000/api/clients/getClientById/:clientId

  private apiUrl = "http://localhost:3000/api/clients";

  constructor(private http: HttpClient) { }

  getClients() : Observable<ClientResponse>{
    return this.http.get<ClientResponse>(`${this.apiUrl}/getAllClients`);
  }

  getClientById(clientId : number) : Observable<UserResponse>{
    return this.http.get<UserResponse>(`${this.apiUrl}/getClientById/${clientId}`);
  }

  softDelete(clientId: number){
    return this.http.patch(`${this.apiUrl}/${clientId}`, '');
  }

  reactivateClient(userId : number){
    return this.http.put(`http://localhost:3000/api/users/reactivate/${userId}`, {});
  }

  updateClient(clientId:number, clientData: any){
    return this.http.put(`${this.apiUrl}/${clientId}`, clientData);
  }

  deleteClient(clientId : number){
    return this.http.delete(`${this.apiUrl}/${clientId}`);
  }
}
