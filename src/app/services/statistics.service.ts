import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Statistics, AmountStatistics, InsuranceStatistics } from '../interfaces/statistics';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStatistics(): Observable<Statistics> {
    return this.http.get<Statistics>(`${this.apiUrl}Statistics`);
  }

  getAmountByDateRange(startDate?: Date, endDate?: Date): Observable<AmountStatistics> {
    let params = new HttpParams();
    if (startDate) {
      // Format as YYYY-MM-DD in local time (not UTC to avoid timezone issues)
      const year = startDate.getFullYear();
      const month = String(startDate.getMonth() + 1).padStart(2, '0');
      const day = String(startDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      params = params.set('startDate', dateStr);
    }
    if (endDate) {
      // Format as YYYY-MM-DD in local time (not UTC to avoid timezone issues)
      const year = endDate.getFullYear();
      const month = String(endDate.getMonth() + 1).padStart(2, '0');
      const day = String(endDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      params = params.set('endDate', dateStr);
    }
    return this.http.get<AmountStatistics>(`${this.apiUrl}Statistics/amount`, { params });
  }

  getInsuranceStatistics(): Observable<InsuranceStatistics[]> {
    return this.http.get<InsuranceStatistics[]>(`${this.apiUrl}Statistics/insurance`);
  }

  getInsuranceStatisticsByDateRange(startDate?: Date, endDate?: Date): Observable<InsuranceStatistics[]> {
    let params = new HttpParams();
    if (startDate) {
      const year = startDate.getFullYear();
      const month = String(startDate.getMonth() + 1).padStart(2, '0');
      const day = String(startDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      params = params.set('startDate', dateStr);
    }
    if (endDate) {
      const year = endDate.getFullYear();
      const month = String(endDate.getMonth() + 1).padStart(2, '0');
      const day = String(endDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      params = params.set('endDate', dateStr);
    }
    return this.http.get<InsuranceStatistics[]>(`${this.apiUrl}Statistics/insurance/by-date-range`, { params });
  }
}

