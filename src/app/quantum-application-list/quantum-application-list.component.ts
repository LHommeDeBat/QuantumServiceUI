import { Component, OnInit } from '@angular/core';
import { QuantumApplicationService } from '../services/quantum-application.service';
import { AddApplicationComponent } from '../dialogs/add-application/add-application.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-quantum-application-list',
  templateUrl: './quantum-application-list.component.html',
  styleUrls: ['./quantum-application-list.component.scss']
})
export class QuantumApplicationListComponent implements OnInit {

  quantumApplications = [];

  constructor(private quantumApplicationService: QuantumApplicationService,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.quantumApplicationService.getQuantumApplications().subscribe(response => {
      if (response._embedded) {
        this.quantumApplications = response._embedded.quantumApplicationDtoList;
        console.log(this.quantumApplications);
      }
    });
  }

  addQuantumApplication(): void {
    const dialogRef = this.dialog.open(AddApplicationComponent, {});
  }

}
