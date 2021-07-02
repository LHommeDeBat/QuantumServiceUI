import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventTriggerService } from '../../services/event-trigger.service';

@Component({
  selector: 'app-register-events',
  templateUrl: './register-event-triggers.component.html',
  styleUrls: ['./register-event-triggers.component.scss']
})
export class RegisterEventTriggersComponent implements OnInit {

  availableEventTriggers: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: RegisterEventTriggers,
              private eventService: EventTriggerService,
              private dialogRef: MatDialogRef<RegisterEventTriggersComponent>) { }

  ngOnInit(): void {
    this.getAvailableEventTriggers();
  }

  getAvailableEventTriggers(): void {
    this.availableEventTriggers = [];
    this.eventService.getEventTriggers().subscribe(response => {
      const eventTriggers = response._embedded ? response._embedded.eventTriggerDtoList : [];
      // Filter only eventTriggers that are not already linked to current application
      for (const eventTrigger of eventTriggers) {
        if (this.data.registeredEventTriggers.find(e => e.id === eventTrigger.id) == undefined) {
          this.availableEventTriggers.push(eventTrigger);
        }
      }
    });
  }

  generateEventTypeDisplay(eventTrigger: any): string {
    if (eventTrigger.eventType === 'QUEUE_SIZE') {
      return eventTrigger.eventType + ' <= ' + eventTrigger.additionalProperties.queueSize;
    }
    return eventTrigger.name;
  }

  close(): void {
    this.dialogRef.close();
  }

  registerApplicationToEventTrigger(eventTrigger: any) {
    this.eventService.registerApplication(eventTrigger.name, this.data.application.name).subscribe(() => {
      this.data.registeredEventTriggers.push(eventTrigger);
      this.getAvailableEventTriggers();
    });
  }
}

export interface RegisterEventTriggers {
  application: any;
  registeredEventTriggers: any[];
}
