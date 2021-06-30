import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuantumApplicationUpload } from '../models/QuantumApplicationUpload';

@Injectable({
  providedIn: 'root'
})
export class QuantumApplicationService {

  url = 'http://localhost:9005/quantum-applications';

  constructor(private http: HttpClient) {}

  getQuantumApplications(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  getApplicationEvents(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  downloadApplicationScript(url: string): Observable<any> {
    // @ts-ignore
    return this.http.get<any>(url, { responseType: 'blob'});
  }

  createQuantumApplication(dto: QuantumApplicationUpload, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('script', file);
    formData.append('dto', JSON.stringify(dto));

    return this.http.post<any>(this.url, formData);
  }

  deleteQuantumApplication(url: string): Observable<any> {
    return this.http.delete<any>(url);
  }

  invokeApplication(url: string, dto: any) {
    return this.http.post<any>(url, dto);
  }
}
