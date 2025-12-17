import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Appointment, CreateAppointment, UpdateAppointment } from '../interfaces/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAppointments(
    startDate?: Date,
    endDate?: Date,
    doctorId?: number,
    patientId?: number,
    status?: string
  ): Observable<Appointment[]> {
    let params = new HttpParams();
    
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    if (doctorId) {
      params = params.set('doctorId', doctorId.toString());
    }
    if (patientId) {
      params = params.set('patientId', patientId.toString());
    }
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<Appointment[]>(`${this.apiUrl}Appointments`, { params });
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}Appointments/${id}`);
  }

  createAppointment(appointment: CreateAppointment): Observable<any> {
    return this.http.post(`${this.apiUrl}Appointments`, appointment);
  }

  updateAppointment(id: number, appointment: UpdateAppointment): Observable<any> {
    return this.http.put(`${this.apiUrl}Appointments/${id}`, appointment);
  }

  deleteAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}Appointments/${id}`);
  }

  updateAppointmentStatus(id: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}Appointments/${id}/status`, { status: status });
  }

  getAppointmentsByDoctor(doctorId: number, startDate?: Date, endDate?: Date): Observable<Appointment[]> {
    let params = new HttpParams();
    if (startDate) {
      params = params.set('startDate', startDate.toISOString());
    }
    if (endDate) {
      params = params.set('endDate', endDate.toISOString());
    }
    return this.http.get<Appointment[]>(`${this.apiUrl}Appointments/doctor/${doctorId}`, { params });
  }

  getAppointmentsByPatient(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}Appointments/patient/${patientId}`);
  }
}

