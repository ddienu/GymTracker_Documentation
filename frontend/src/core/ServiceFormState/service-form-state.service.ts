import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceFormStateService {

  private isEditting = new BehaviorSubject<boolean>(false);

  isEditting$ = this.isEditting.asObservable();

  setEditMode(isEdit : boolean){
    this.isEditting.next(isEdit);
  }

  private serviceIdToEdit = new BehaviorSubject<number | null>(null);
  serviceIdToEdit$ = this.serviceIdToEdit.asObservable();

  setServiceIdToEdit(serviceId:number){
    this.serviceIdToEdit.next(serviceId);
  }

}
