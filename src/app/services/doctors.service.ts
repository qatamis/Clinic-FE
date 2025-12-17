import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Doctor, CreateDoctor } from '../interfaces/doctor';
import { AuthResponse } from '../interfaces/auth-response';

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}Doctors`);
  }

  getDoctorById(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}Doctors/${id}`);
  }

  createDoctor(doctor: CreateDoctor): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}Doctors`, doctor);
  }

  updateDoctor(id: number, doctor: CreateDoctor): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}Doctors/${id}`, doctor);
  }

  updateDoctorPassword(id: number, newPassword: string): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}Doctors/${id}/password`, { newPassword });
  }

  updateDoctorStatus(id: number, isActive: boolean): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}Doctors/${id}/status`, { isActive });
  }

  deleteDoctor(id: number): Observable<AuthResponse> {
    return this.http.delete<AuthResponse>(`${this.apiUrl}Doctors/${id}`);
  }
}

