import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface MyTokenPayload{
  id: number;
  username: string;
  role: string;
  isAdmin: boolean;
  iat: number;
  exp: number;
}


@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  extractUsernameFromToken():string{
  const token = localStorage.getItem('token');
    if(token){
      const decoded = jwtDecode<MyTokenPayload>(token);
      return decoded.username;
    }
    return "";
  }

  extractRoleFromToken():string{
    const token = localStorage.getItem('token');
    if(token){
      const decoded = jwtDecode<MyTokenPayload>(token);
      return decoded.role;
    }
    return "";
  }

  getProfileIdFromToken(): number | null{
    const token = localStorage.getItem('token');
    if(token){
      const decoded = jwtDecode<MyTokenPayload>(token);
      return decoded.id;
    }
    return null;
  }
}
