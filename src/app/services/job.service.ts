import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  url = 'http://localhost:9005/jobs';

  constructor(private http: HttpClient) { }

  getJobs(page: number, size: number, sort: any, url?: string): Observable<any> {
    // Setup log namespace query parameter
    let params = new HttpParams();
    if (!url) {
      params = params.append('page', page);
      params = params.append('size', size);

      for (const fieldSort in sort) {
        params = params.append('sort', fieldSort + ',' + sort[fieldSort])
      }
    }

    return this.http.get<any>(url ? url : this.url, { params: params });
  }
}
