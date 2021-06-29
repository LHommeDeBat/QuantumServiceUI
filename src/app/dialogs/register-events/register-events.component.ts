import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-register-events',
  templateUrl: './register-events.component.html',
  styleUrls: ['./register-events.component.scss']
})
export class RegisterEventsComponent implements OnInit {

  availableEvents: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: RegisterEvents,
              private eventService: EventService,
              private dialogRef: MatDialogRef<RegisterEventsComponent>) { }

  ngOnInit(): void {
    this.getAvailableEvents();
  }

  getAvailableEvents(): void {
    this.availableEvents = [];
    this.eventService.getEvents().subscribe(response => {
      const events = response._embedded ? response._embedded.eventDtoList : [];
      // Filter only events that are not already linked to current application
      for (const event of events) {
        if (this.data.registeredEvents.find(e => e.id === event.id) == undefined) {
          this.availableEvents.push(event);
        }
      }
    });
  }

  generateEventTypeDisplay(event: any): string {
    if (event.type === 'QUEUE_SIZE') {
      return event.type + ' <= ' + event.additionalProperties.queueSize;
    }
    return event.name;
  }

  close(): void {
    this.dialogRef.close();
  }

  registerApplicationToEvent(event: any) {
    this.eventService.registerApplication(event.name, this.data.application.name).subscribe(() => {
      this.data.registeredEvents.push(event);
      this.getAvailableEvents();
    });
  }
}

export interface RegisterEvents {
  application: any;
  registeredEvents: any[];
}
