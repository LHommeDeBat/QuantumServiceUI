import { Component, OnInit } from '@angular/core';
import { QuantumApplicationService } from '../services/quantum-application.service';
import { AddApplicationComponent } from '../dialogs/add-application/add-application.component';
import { MatDialog } from '@angular/material/dialog';
import { QuantumApplicationUpload } from '../models/QuantumApplicationUpload';

@Component({
  selector: 'app-quantum-application-list',
  templateUrl: './quantum-application-list.component.html',
  styleUrls: ['./quantum-application-list.component.scss']
})
export class QuantumApplicationListComponent implements OnInit {

  quantumApplications: any[] = [];

  constructor(private quantumApplicationService: QuantumApplicationService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getQuantumApplications();
  }

  getQuantumApplications(): void {
    this.quantumApplicationService.getQuantumApplications().subscribe(response => {
      if (response._embedded) {
        this.quantumApplications = response._embedded.quantumApplicationDtoList;
        console.log(this.quantumApplications);
      }
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
      this.getQuantumApplications();
    });
  }
}
