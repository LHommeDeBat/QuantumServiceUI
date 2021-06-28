import { EventService } from '../services/event.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  events: any[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(response => {
      if (response._embedded) {
        this.events = response._embedded.eventDtoList;
        console.log(this.events);
      }
    });
  }
}
