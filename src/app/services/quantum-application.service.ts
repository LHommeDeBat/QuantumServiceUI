import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuantumApplicationService {

  url = 'http://localhost:9005/quantum-applications';

  constructor(private http: HttpClient) {}

  getQuantumApplications(): Observable<any> {
    return this.http.get<any>(this.url);
  }
}
