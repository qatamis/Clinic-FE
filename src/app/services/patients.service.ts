import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../interfaces/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getPatients = (): Observable<Patient[]> =>
    this.http.get<Patient[]>(`${this.apiUrl}Patients`);

  getPatientById(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}Patients/` + id);
  }

  updatePatientById(id: number, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}Patients/` + id, patient);
  }

  getPatientBySearchKeyword(searchKeyword: string = ''): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}Patients/` + searchKeyword);
  }

  addPatient(newProduct: Patient): Observable<Patient> {
    newProduct.id = 0;
    return this.http.post<Patient>(`${this.apiUrl}Patients/`, newProduct);
  }

  deletePatientById(id: number) {
    const isDeleteConfirmed = confirm("Are You Sure you want to Delete");
    if(isDeleteConfirmed){
      this.http.delete(`${this.apiUrl}Patients/` + id).subscribe((res => {
        this.getPatients();
      }))
    }
  }
}
