import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { JobService } from '../services/job.service';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit, OnDestroy {

  // Pagination variables
  page: number = 0;
  pageSize: number = 25;
  sort: any = {
    scriptExecutionDate: 'desc'
  };
  jobTimer: any;

  // Filter variables
  availableStatuses: string[] = [
    'CREATING',
    'CREATED',
    'VALIDATING',
    'VALIDATED',
    'RUNNING',
    'COMPLETED'
  ];
  statusFilter: string[] = [];

  jobs: any[] = [];
  selectedJob: any = undefined;
  @ViewChild('drawer') public drawer: MatDrawer | undefined;

  paginationLinks: any = undefined;
  paginationDetails: any = undefined;

  constructor(private jobService: JobService) { }

  ngOnInit(): void {
    this.getJobs();
    this.startJobTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  startJobTimer(): void {
    this.jobTimer = setInterval(() => {
      this.getJobs();
    },10000)
  }

  stopTimer(): void {
    clearInterval(this.jobTimer);
  }

  getJobs(url?: string): void {
    this.jobService.getJobs(this.page, this.pageSize, this.sort, this.statusFilter, url).subscribe(response => {
      this.jobs = response._embedded ? response._embedded.jobDtoList : [];
      this.paginationLinks = response._links ? response._links : undefined;
      this.paginationDetails = response.page ? response.page : undefined;
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

  checkSort(field: string) {
    // Check if sorting is enabled for field
    if (this.sort[field]) {
      return this.sort[field];
    }
    return 'none';
  }

  changeSort(creationDate: string): void {
    if (this.checkSort(creationDate) === 'none') {
      this.sort[creationDate] = 'asc';
    } else if (this.checkSort(creationDate) === 'asc') {
      this.sort[creationDate] = 'desc';
    } else if (this.checkSort(creationDate) === 'desc') {
      delete this.sort[creationDate];
    }
    this.getJobs();
  }
}
