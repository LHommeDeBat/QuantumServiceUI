import { Component, OnInit, ViewChild } from '@angular/core';
import { JobService } from '../services/job.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {

  jobs: any[] = [];
  selectedJob: any = undefined;
  @ViewChild('drawer') public drawer: MatDrawer | undefined;

  constructor(private jobService: JobService) { }

  ngOnInit(): void {
    this.getJobs();
  }

  getJobs(): void {
    this.jobService.getJobs().subscribe(response => {
      this.jobs = response._embedded ? response._embedded.jobDtoList : [];
    });
  }

  selectJob(job: any) {
    if (!this.selectedJob || this.selectedJob.id !== job.id) {
      this.selectedJob = job;
    }
    this.drawer?.open();
  }

  closeDetailsView(): void {
    this.drawer?.close();
    this.selectedJob = undefined;
  }

  parseResult(result: string): any {
    return JSON.parse(result);
  }
}
