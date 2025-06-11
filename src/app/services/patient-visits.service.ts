import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PatientVisits } from '../interfaces/patient-visits';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PatientVisitsService {
  //apiUrl = 'http://localhost:5123/api/patientvisits/';
  apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  addVisit(newVisit: PatientVisits): Observable<PatientVisits> {
    return this.http.post<PatientVisits>(`${this.apiUrl}patientvisits/`, newVisit);
  }

  getVisitsById(id: number): Observable<PatientVisits[]> {
    return this.http.get<PatientVisits[]>(`${this.apiUrl}patientvisits/` + id);
  }

  getVisitsByPatientId(id: number): Observable<PatientVisits> {
    return this.http.get<PatientVisits>(`${this.apiUrl}patientvisits/` + 'patient/' + id);
  }
}
