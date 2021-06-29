import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventDto } from '../models/EventDto';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  url = 'http://localhost:9005/events';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<any> {
    return this.http.get<any>(this.url);
  }

  createEvent(dto: EventDto): Observable<any> {
    return this.http.post<any>(this.url, dto);
  }

  deleteEvent(url: string): Observable<any> {
    return this.http.delete<any>(url);
  }

  unregisterApplication(eventName: string, applicationName: string): Observable<any> {
    return this.http.delete<any>(this.url + '/' + eventName + '/quantum-applications/' + applicationName);
  }

  registerApplication(eventName: string, applicationName: string): Observable<any> {
    return this.http.post<any>(this.url + '/' + eventName + '/quantum-applications/' + applicationName, undefined);
  }
}
