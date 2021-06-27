import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { QuantumApplicationListComponent } from './quantum-application-list/quantum-application-list.component';
import { EventListComponent } from './event-list/event-list.component';
import { JobListComponent } from './job-list/job-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'quantum-applications', pathMatch: 'full' },
  { path: 'quantum-applications', component: QuantumApplicationListComponent },
  { path: 'events', component: EventListComponent },
  { path: 'jobs', component: JobListComponent }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
