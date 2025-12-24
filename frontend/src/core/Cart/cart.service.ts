import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartItem } from '../../features/cart/model/cartItems.model';
import { CartResponse } from '../../features/cart/model/cartResponse.model';
import { RemoveItem } from '../../features/cart/dto/removeItemRequest.dto';
import { RequestCartItem } from '../../features/cart/dto/requestCartItem.dto';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = environment.apiUrl+"/api/cart";

  // private apiUrl = 'http://localhost:3000/api/cart';

  constructor(private http : HttpClient) { }

  getCart(clientId : number) : Observable<CartResponse>{
    return this.http.get<CartResponse>(`${this.apiUrl}/${clientId}`);
  }

  addItemToCart(clientId: number, itemPayload : RequestCartItem){
    return this.http.post(`${this.apiUrl}/${clientId}`, itemPayload);
  }

  updateQuantityInCart(clientId : number, itemPayload : RequestCartItem ){
    return this.http.put(`${this.apiUrl}/${clientId}`, itemPayload);
  }

  removeItemFromCart(clientId : number, itemPayload : RemoveItem) {
    return this.http.delete(`${this.apiUrl}/item_remove/${clientId}`, {body: itemPayload});
  }

  clearCart(clientId : number) : Observable<any>{
    return this.http.delete(`${this.apiUrl}/${clientId}`);
  }
}
