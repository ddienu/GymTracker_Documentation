import { NumberSymbol } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClientModel, ClientResponse } from '../../features/client/model/client.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  // http://localhost:3000/api/clients/getClientById/:clientId

  private apiUrl = "http://localhost:3000/api/clients";

  constructor(private http: HttpClient) { }

  getClients(){
    return this.http.get(`${this.apiUrl}/getAllClients`);
  }

  getClientById(clientId : number) : Observable<ClientResponse>{
    return this.http.get<ClientResponse>(`${this.apiUrl}/getClientById/${clientId}`);
  }

  softDelete(clientId: number){
    return this.http.patch(`${this.apiUrl}/${clientId}`, '');
  }

  updateClient(clientId:number, clientData: any){
    return this.http.put(`${this.apiUrl}/${clientId}`, clientData);
  }

  deleteClient(clientId : number){
    return this.http.delete(`${this.apiUrl}/${clientId}`);
  }
}
