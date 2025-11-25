import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from '../../features/cart/model/cartItems.model';
import { CartResponse } from '../../features/cart/model/cartResponse.model';
import { RemoveItem } from '../../features/cart/dto/removeItemRequest.dto';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:3000/api/cart';

  constructor(private http : HttpClient) { }

  getCart(clientId : number) : Observable<CartResponse>{
    return this.http.get<CartResponse>(`${this.apiUrl}/${clientId}`);
  }

  removeItemFromCart(clientId : number, itemPayload : RemoveItem) {
    return this.http.delete(`${this.apiUrl}/item_remove/${clientId}`, {body: itemPayload});
  }

  clearCart(clientId : number) : Observable<any>{
    return this.http.delete(`${this.apiUrl}/${clientId}`);
  }
}
