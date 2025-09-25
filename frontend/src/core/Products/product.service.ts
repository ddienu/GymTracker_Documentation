import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { mapProductsDtoToProductModels, ProductModel } from '../../features/product/model/product.model';
import { map, Observable } from 'rxjs';
import { ProductDto } from '../../features/product/model/dto/product.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = "http://localhost:3000/api/products";

  constructor(private http : HttpClient) { }

  createProduct(productPayload : ProductModel) : Observable<ProductModel>{
    return this.http.post<ProductModel>(`${this.apiUrl}`, productPayload);
  }
  
  getProducts():Observable<ProductModel[]>{
    return this.http.get<ProductDto[]>(`${this.apiUrl}`).pipe(
      map((response) => mapProductsDtoToProductModels(response))
    );
  }

  deleteProduct(productId : number){
    return this.http.delete(`${this.apiUrl}/${productId}`);
  }


}
