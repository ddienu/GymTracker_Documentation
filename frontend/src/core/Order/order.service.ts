import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = `${environment.apiUrl}/api/client_order`;

  constructor(private http : HttpClient) { }

  generateOrder(profileId : number, paymentMethodId : number){
    return this.http.post(`${this.apiUrl}/${profileId}`, {paymentMethodId});
  }
}
