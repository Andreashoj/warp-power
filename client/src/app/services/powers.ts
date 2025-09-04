import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WarpPower {
  id: number;
  name: string;
  description: string;
  powerLevel: number;
}

export interface CreateWarpPowerDto {
  name: string;
  description: string;
  powerLevel: number;
}

@Injectable({
  providedIn: 'root'
})
export class PowersService {
  private readonly apiUrl = 'https://localhost:7136/api/powers'; // Will be updated for production

  constructor(private http: HttpClient) { }

  getPowers(): Observable<WarpPower[]> {
    return this.http.get<WarpPower[]>(this.apiUrl);
  }

  getPower(id: number): Observable<WarpPower> {
    return this.http.get<WarpPower>(`${this.apiUrl}/${id}`);
  }

  createPower(power: CreateWarpPowerDto): Observable<WarpPower> {
    return this.http.post<WarpPower>(this.apiUrl, power);
  }
}
