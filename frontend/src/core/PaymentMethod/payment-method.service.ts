import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { PaymentMethodResponse } from '../../features/payment-method/model/paymentMethodResponse.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentMethodService {

  private apiUrl = `${environment.apiUrl}/api/payment-methods`;

  constructor(private http : HttpClient) { }

  getPaymentMethods() : Observable<PaymentMethodResponse[]>{
    return this.http.get<PaymentMethodResponse[]>(`${this.apiUrl}`);
  }
}
