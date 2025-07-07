import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rate } from '../models/rate.model';

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
}
