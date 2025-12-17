import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { InsuranceCompany } from '../interfaces/insurance-company';

@Injectable({
  providedIn: 'root'
})
export class InsuranceCompaniesService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllInsuranceCompanies(): Observable<InsuranceCompany[]> {
    return this.http.get<InsuranceCompany[]>(`${this.apiUrl}insurancecompanies`);
  }

  getActiveInsuranceCompanies(): Observable<InsuranceCompany[]> {
    return this.http.get<InsuranceCompany[]>(`${this.apiUrl}insurancecompanies/active`);
  }

  getInsuranceCompanyById(id: number): Observable<InsuranceCompany> {
    return this.http.get<InsuranceCompany>(`${this.apiUrl}insurancecompanies/${id}`);
  }

  createInsuranceCompany(company: Partial<InsuranceCompany>): Observable<any> {
    return this.http.post(`${this.apiUrl}insurancecompanies`, company);
  }

  updateInsuranceCompany(id: number, company: Partial<InsuranceCompany>): Observable<any> {
    return this.http.put(`${this.apiUrl}insurancecompanies/${id}`, company);
  }

  deleteInsuranceCompany(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}insurancecompanies/${id}`);
  }
}

