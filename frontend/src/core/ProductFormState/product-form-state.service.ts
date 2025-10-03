import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductFormStateService {

  private isEditting = new BehaviorSubject<boolean>(false);

  isEditting$ = this.isEditting.asObservable();

  setEditMode(isEdit: boolean) {
    this.isEditting.next(isEdit);
  }

  private productIdToEdit = new BehaviorSubject<number | null>(null);
  productIdToEdit$ = this.productIdToEdit.asObservable();

  setServiceIdToEdit(productId: number) {
    this.productIdToEdit.next(productId);
  }
}
