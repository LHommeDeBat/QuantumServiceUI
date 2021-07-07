import { Component, OnInit, ViewChild } from '@angular/core';
import { QuantumApplicationService } from '../services/quantum-application.service';
import { AddQuantumApplicationComponent } from '../dialogs/add-quantum-application/add-quantum-application.component';
import { MatDialog } from '@angular/material/dialog';
import { QuantumApplicationUpload } from '../models/quantum-application-upload';
import { MatDrawer } from '@angular/material/sidenav';
import { EventTriggerService } from '../services/event-trigger.service';
import { RegisterEventTriggersComponent } from '../dialogs/register-event-triggers/register-event-triggers.component';
import { InvokeQuantumApplicationComponent } from '../dialogs/invoke-quantum-application/invoke-quantum-application.component';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-quantum-application-list',
  templateUrl: './quantum-application-list.component.html',
  styleUrls: ['./quantum-application-list.component.scss']
})
export class QuantumApplicationListComponent implements OnInit {

  quantumApplications: any[] = [];
  selectedApplication: any = undefined;
  applicationEventTriggers: any[] = [];
  reader: FileReader = new FileReader();

  @ViewChild('drawer') public drawer: MatDrawer | undefined;

  constructor(private quantumApplicationService: QuantumApplicationService,
              private eventService: EventTriggerService,
              private toastService: ToastService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getQuantumApplications();

    this.reader.addEventListener('loadend', (e) => {
      if (e.target) {
        this.selectedApplication.script = e.target.result;
      }
    });
  }

  getQuantumApplications(): void {
    this.quantumApplicationService.getQuantumApplications().subscribe(response => {
      this.quantumApplications = response._embedded ? response._embedded.quantumApplicationDtoList : [];
    });
  }

  getApplicationEventTriggers(url: string): void {
      this.quantumApplicationService.getApplicationEventTriggers(url).subscribe(response => {
        this.applicationEventTriggers = response._embedded ? response._embedded.eventTriggerDtoList : [];
      });
  }

  addQuantumApplication(): void {
    const dialogRef = this.dialog.open(AddQuantumApplicationComponent, {
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
      this.getQuantumApplications();
    });
  }

  selectApplication(application: any): void {
    if (!this.selectedApplication || this.selectedApplication.id !== application.id) {
      this.selectedApplication = application;
      this.getApplicationEventTriggers(application._links.eventTriggers.href);
      this.downloadApplicationScript(application, false);
    }
    this.drawer?.open();
  }

  closeDetailsView(): void {
    this.drawer?.close();
    this.applicationEventTriggers = [];
    this.selectedApplication = undefined;
  }

  unregisterApplicationFromEventTrigger(selectedApplication: any, eventTrigger: any) {
    this.eventService.unregisterApplication(eventTrigger.name, selectedApplication.name).subscribe(() => {
      this.getApplicationEventTriggers(selectedApplication._links.eventTriggers.href);
    });
  }

  generateEventTypeDisplay(eventTrigger: any): string {
    if (eventTrigger.eventType === 'QUEUE_SIZE') {
      return eventTrigger.eventType + ' <= ' + eventTrigger.additionalProperties.queueSize;
    }
    return eventTrigger.name;
  }

  openRegisterEventTriggersDialog(): void {
    const dialogRef = this.dialog.open(RegisterEventTriggersComponent, {
      width: '50%',
      data: {
        application: this.selectedApplication,
        registeredEventTriggers: this.applicationEventTriggers
      },
    });

    dialogRef.afterClosed().subscribe(() => {
     this.getApplicationEventTriggers(this.selectedApplication._links.eventTriggers.href);
    });
  }

  invokeApplication(application: any): void {
    const dialogRef = this.dialog.open(InvokeQuantumApplicationComponent, {
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

  downloadApplicationScript(application: any, downloadToFilesystem: boolean): void {
    this.quantumApplicationService.downloadApplicationScript(application._links.script.href).subscribe(response => {
      if (downloadToFilesystem) {
        const anchor = document.createElement('a');
        anchor.download = application.name + '.py';
        anchor.href = (window.webkitURL || window.URL).createObjectURL(response);
        anchor.click();
      } else {
        this.reader.readAsText(response);
      }
    });
  }
}
