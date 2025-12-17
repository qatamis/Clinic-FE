import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { map, Observable } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from "jwt-decode";
import { RegisterRequest } from '../interfaces/register-request';
import { UserDetail } from '../interfaces/user-detail';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiUrl:string = environment.apiUrl;
  private tokenKey = 'token';
  // Signal to track token changes for reactivity
  private tokenSignal = signal<string | null>(null);

  constructor(private http: HttpClient) { 
    // Initialize signal with current token
    const initialToken = localStorage.getItem(this.tokenKey) || null;
    this.tokenSignal.set(initialToken);
  }

  Login(data:LoginRequest): Observable<AuthResponse>{
  return this.http.post<AuthResponse>(`${this.apiUrl}account/login`, data).pipe(
    map((response)=>{
      if(response.isSuccess && response.token){
        localStorage.setItem(this.tokenKey, response.token);
        this.tokenSignal.set(response.token); // Update signal to trigger reactivity
      }
      return response;
    })
  );
  }

  Register(data:RegisterRequest): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(`${this.apiUrl}account/register`, data)
  }

  getDetail=(): Observable<UserDetail>=>
    this.http.get<UserDetail>(`${this.apiUrl}account/detail`)

  getUserDetail=()=>{
    const token = this.getToken();
    if(!token) return null;
    const decodedToken:any = jwtDecode(token);
    
    // Extract roles from token - roles can be in different claim types
    let roles: string[] = [];
    if (decodedToken.role) {
      roles = Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role];
    } else if (decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
      const roleClaim = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];
    } else if (decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role']) {
      const roleClaim = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role'];
      roles = Array.isArray(roleClaim) ? roleClaim : [roleClaim];
    }
    
    const userDetail = {
      id:decodedToken.nameId,
      fullName: decodedToken.name,
      email:decodedToken.email,
      roles: roles
    }

    return userDetail;
  }

  isLoggedIn = ():boolean => {
    const token = this.getToken();
    if(!token)
    {
      return false;
    }

    return !this.isTokenExpired();
  }

  private isTokenExpired() {
    const token = this.getToken();
    if(!token) return true;
    const decoded = jwtDecode(token);
    const isTokenExpired  = Date.now() >= decoded['exp']! * 1000;
    if(isTokenExpired) this.logout();
    return isTokenExpired;
  }

  logout=():void => {
    localStorage.removeItem(this.tokenKey);
    this.tokenSignal.set(null); // Update signal to trigger reactivity
  }

  getToken = ():string | null => localStorage.getItem(this.tokenKey) || '';

  // Getter for the token signal to make it accessible for reactivity
  getTokenSignal = () => this.tokenSignal.asReadonly();

  resetPassword(currentPassword: string, newPassword: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}account/reset-password`, {
      currentPassword,
      newPassword
    });
  }
}
