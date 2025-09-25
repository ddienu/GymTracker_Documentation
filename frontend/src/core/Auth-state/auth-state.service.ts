import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";


@Injectable({ providedIn:'root' })
export class AuthStateService {
    private registerMode = new BehaviorSubject<boolean>(false);
    private registerFrom = new BehaviorSubject<string>("");

    private editMode = new BehaviorSubject<boolean>(false);
    private clientId = new BehaviorSubject<number>(0);

    private userIdLogged = new BehaviorSubject<number>(0);

    registerMode$ = this.registerMode.asObservable();
    registerFrom$ = this.registerFrom.asObservable();

    editMode$ = this.editMode.asObservable();
    clientId$ = this.clientId.asObservable();

    userIdLogged$ = this.userIdLogged.asObservable();
    
    setRegisterMode(isRegister : boolean, registerFrom : string){
        this.registerMode.next(isRegister);
        this.registerFrom.next(registerFrom);
    }

    setEditMode(isEditing:boolean){
        this.editMode.next(isEditing);
    }

    setClientId(id:number){
        this.clientId.next(id);
    }
    setUserIdlogged(id:number){
        this.userIdLogged.next(id);
    }
}