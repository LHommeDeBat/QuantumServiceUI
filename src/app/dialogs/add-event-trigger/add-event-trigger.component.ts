import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventTriggerDto } from '../../models/event-trigger-dto';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event-trigger.component.html',
  styleUrls: ['./add-event-trigger.component.scss']
})
export class AddEventTriggerComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl(this.data.name ? this.data.name : '', [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ]),
    eventType: new FormControl(this.data.eventType ? this.data.eventType : 'QUEUE_SIZE', [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ]),
    queueSize: new FormControl(this.data.queueSize ? this.data.queueSize : undefined, [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ]),
    executedApplication: new FormControl(this.data.executedApplication ? this.data.executedApplication : undefined, [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: EventTriggerDto,
              private dialogRef: MatDialogRef<AddEventTriggerComponent>) {
  }

  ngOnInit(): void {
    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.name = this.name ? this.name.value : undefined;
      this.data.eventType = this.eventType ? this.eventType.value : undefined;
      if (this.data.eventType === 'QUEUE_SIZE') {
        this.data.queueSize = this.queueSize ? this.queueSize.value : undefined;
      }
      if (this.data.eventType === 'EXECUTION_RESULT') {
        this.data.executedApplication = this
      }
    });
  }

  get name(): AbstractControl | null {
    return this.form ? this.form.get('name') : null;
  }

  get eventType(): AbstractControl | null {
    return this.form ? this.form.get('eventType') : null;
  }

  get queueSize(): AbstractControl | null {
    return this.form ? this.form.get('queueSize') : null;
  }

  get executedApplication(): AbstractControl | null {
    return this.form ? this.form.get('executedApplication') : null;
  }

  isRequiredDataMissing(): boolean {
    // @ts-ignore
    return (
      this.name?.errors?.required ||
      this.eventType?.errors?.required ||
      (this.eventType?.value === 'QUEUE_SIZE' && this.queueSize?.errors?.required) ||
      (this.eventType?.value === 'EXECUTION_RESULT' && this.executedApplication?.errors?.required)
    );
  }

  close(): void {
    this.dialogRef.close();
  }
}
