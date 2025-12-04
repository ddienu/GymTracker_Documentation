import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { PaymentOrderResponse } from '../../features/payment/model/paymentResponse.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = `${environment.apiUrl}/api/payments`;

  constructor(private http : HttpClient) { }

  getPaymentsByProfileId(profileId : number) : Observable<{message : string, data : PaymentOrderResponse[]}>{
    return this.http.get<{message : string, data: PaymentOrderResponse[]}>(`${this.apiUrl}/${profileId}`);
  }
}
