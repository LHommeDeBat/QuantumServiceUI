import { EventService } from '../services/event.service';
import { Component, OnInit } from '@angular/core';
import { EventDto } from '../models/EventDto';
import { MatDialog } from '@angular/material/dialog';
import { AddEventComponent } from '../dialogs/add-event/add-event.component';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  events: any[] = [];

  constructor(private eventService: EventService,
              private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.eventService.getEvents().subscribe(response => {
      if (response._embedded) {
        this.events = response._embedded.eventDtoList;
        console.log(this.events);
      }
    });
  }

  addEvent(): void {
    const dialogRef = this.dialog.open(AddEventComponent, {
      data: {
        name: '',
        type: '',
        additionalProperties: {}
      },
    });

    dialogRef.afterClosed().subscribe((data: EventDto) => {
      if (data) {
        const dto: EventDto = {
          name: data.name,
          type: data.type,
          additionalProperties: data.additionalProperties,
        };

        this.eventService.createEvent(dto).subscribe(() => {
          this.getEvents();
        });
      }
    });
  }

  deleteEvent(url: string): void {
    this.eventService.deleteEvent(url).subscribe(() => {
      this.getEvents();
    })
  }

  generateNameDisplay(event: any): string {
    if (event.type === 'QUEUE_SIZE') {
      return event.type + ' <= ' + event.additionalProperties.queueSize;
    }
    return event.name;
  }
}
