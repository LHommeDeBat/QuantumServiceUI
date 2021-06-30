import { Component, OnInit, ViewChild } from '@angular/core';
import { QuantumApplicationService } from '../services/quantum-application.service';
import { AddApplicationComponent } from '../dialogs/add-application/add-application.component';
import { MatDialog } from '@angular/material/dialog';
import { QuantumApplicationUpload } from '../models/QuantumApplicationUpload';
import { MatDrawer } from '@angular/material/sidenav';
import { EventService } from '../services/event.service';
import { RegisterEventsComponent } from '../dialogs/register-events/register-events.component';
import { GenerateEventComponent } from '../dialogs/generate-event/generate-event.component';
import { FireEventDto } from '../models/FireEventDto';
import { InvokeActionComponent } from '../dialogs/invoke-action/invoke-action.component';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-quantum-application-list',
  templateUrl: './quantum-application-list.component.html',
  styleUrls: ['./quantum-application-list.component.scss']
})
export class QuantumApplicationListComponent implements OnInit {

  quantumApplications: any[] = [];
  selectedApplication: any = undefined;
  applicationEvents: any[] = [];
  @ViewChild('drawer') public drawer: MatDrawer | undefined;

  constructor(private quantumApplicationService: QuantumApplicationService,
              private eventService: EventService,
              private toastService: ToastService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getQuantumApplications();
  }

  getQuantumApplications(): void {
    this.quantumApplicationService.getQuantumApplications().subscribe(response => {
      this.quantumApplications = response._embedded ? response._embedded.quantumApplicationDtoList : [];
    });
  }

  getApplicationEvents(url: string): void {
      this.quantumApplicationService.getApplicationEvents(url).subscribe(response => {
        this.applicationEvents = response._embedded ? response._embedded.eventDtoList : [];
      });
  }

  addQuantumApplication(): void {
    const dialogRef = this.dialog.open(AddApplicationComponent, {
      data: {
        title: 'Add new Quantum-Application',
        name: '',
        file: undefined
      },
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        const dto: QuantumApplicationUpload = {
          name: data.name
        }
        this.quantumApplicationService.createQuantumApplication(dto, data.file).subscribe(() => {
          this.getQuantumApplications();
        });
      }
    });
  }

  deleteQuantumApplication(url: string): void {
    this.quantumApplicationService.deleteQuantumApplication(url).subscribe(() => {
      console.log('DELETED via: ' + url);
      this.getQuantumApplications();
    });
  }

  selectApplication(application: any): void {
    if (!this.selectedApplication || this.selectedApplication.id !== application.id) {
      this.selectedApplication = application;
      this.getApplicationEvents(application._links.events.href);
    }
    this.drawer?.open();
    console.log(this.selectedApplication);
  }

  closeDetailsView(): void {
    this.drawer?.close();
    this.applicationEvents = [];
    this.selectedApplication = undefined;
  }

  unregisterApplicationFromEvent(selectedApplication: any, event: any) {
    this.eventService.unregisterApplication(event.name, selectedApplication.name).subscribe(() => {
      this.getApplicationEvents(selectedApplication._links.events.href);
    });
  }

  generateEventTypeDisplay(event: any): string {
    if (event.type === 'QUEUE_SIZE') {
      return event.type + ' <= ' + event.additionalProperties.queueSize;
    }
    return event.name;
  }

  openRegisterEventsDialog(): void {
    const dialogRef = this.dialog.open(RegisterEventsComponent, {
      width: '50%',
      data: {
        application: this.selectedApplication,
        registeredEvents: this.applicationEvents
      },
    });

    dialogRef.afterClosed().subscribe(() => {
     this.getApplicationEvents(this.selectedApplication._links.events.href);
    });
  }

  invokeApplication(application: any): void {
    const dialogRef = this.dialog.open(InvokeActionComponent, {
      data: {
        applicationName: application.name,
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        const dto: any = {
          device: data.device,
          replyTo: data.replyTo,
        };

        this.quantumApplicationService.invokeApplication(application._links.invoke.href, dto).subscribe(() => {
          this.toastService.displayToast('Application invocation was successfully transmitted!');
        });
      }
    });
  }
}
