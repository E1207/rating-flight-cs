import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Rate } from '../models/rate.model';
import { RateStatus } from '../models/rate-status.model';

@Injectable({ providedIn: 'root' })
export class RateService {
  private apiUrl = 'http://localhost:8080/api/rates';

  constructor(private http: HttpClient) {}

  createRate(rate: Rate): Observable<Rate> {
    return this.http.post<Rate>(this.apiUrl, rate);
  }

  getRates(): Observable<Rate[]> {
    return this.http.get<Rate[]>(this.apiUrl);
  }

  updateRateStatus(rateId: number, status: RateStatus): Observable<Rate> {
    const url = `${this.apiUrl}/${rateId}/status?status=${status}`;
    return this.http.patch<Rate>(url, {});
  }

  getPublishedRates(): Observable<Rate[]> {
    return this.http.get<Rate[]>(`${this.apiUrl}/published`);
  }

  getRateById(id: number): Observable<Rate> {
    return this.http.get<Rate>(`${this.apiUrl}/${id}`);
  }
}
