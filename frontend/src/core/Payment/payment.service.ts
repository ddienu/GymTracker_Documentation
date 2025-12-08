import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { PaymentOrderResponse } from '../../features/payment/model/paymentResponse.model';
import { Observable } from 'rxjs';
import { OrderItemDetail } from '../../features/payment/model/orderItemDetail.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = `${environment.apiUrl}/api/payments`;
  private apiOrderUrl = `${environment.apiUrl}/api/client_order`;

  constructor(private http : HttpClient) { }

  getPaymentsByProfileId(profileId : number) : Observable<{message : string, data : PaymentOrderResponse[]}>{
    return this.http.get<{message : string, data: PaymentOrderResponse[]}>(`${this.apiUrl}/${profileId}`);
  }

  getPaymentsByClientId(clientId : number) : Observable<{data : PaymentOrderResponse[]}>{
    return this.http.get<{data : PaymentOrderResponse[]}>(`${this.apiUrl}/client/${clientId}`);
  }

  getOrderDetailById(orderId : number) : Observable<{data : OrderItemDetail[]}>{
    return this.http.get<{data : OrderItemDetail[]}>(`${this.apiOrderUrl}/${orderId}`);
  }

  generatePdf(html : string){
    return this.http.post(`${this.apiOrderUrl}/generate/pdf`,  {html}, {responseType: 'blob'});
  }
}
