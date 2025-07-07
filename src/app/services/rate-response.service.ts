import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RateResponse } from '../models/RateResponse.model';

export interface CreateRateResponseRequest {
  response: string;
}

@Injectable({ providedIn: 'root' })
export class RateResponseService {
  private apiUrl = 'http://localhost:8080/api/rates';

  constructor(private http: HttpClient) {}

  createResponse(rateId: number, response: string): Observable<RateResponse> {
    const requestBody: CreateRateResponseRequest = {
      response: response
    };
    
    // Temporaire : utiliser l'endpoint existant si disponible
    // Remplacez par l'URL correcte de votre API
    return this.http.post<RateResponse>(`${this.apiUrl}/${rateId}/responses`, requestBody);
  }

  getResponsesForRate(rateId: number): Observable<RateResponse[]> {
    return this.http.get<RateResponse[]>(`${this.apiUrl}/${rateId}/responses`);
  }
}
