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
    queueSize: new FormControl(this.data.additionalProperties && this.data.additionalProperties.queueSize ? this.data.additionalProperties.queueSize : undefined, [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: EventTriggerDto,
              private dialogRef: MatDialogRef<AddEventTriggerComponent>) {
  }

  ngOnInit(): void {
    if (!this.data.additionalProperties) {
      this.data.additionalProperties = {};
    }

    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.name = this.name ? this.name.value : undefined;
      this.data.eventType = this.eventType ? this.eventType.value : undefined;
      if (this.data.eventType === 'QUEUE_SIZE') {
        this.data.additionalProperties.queueSize = this.queueSize ? this.queueSize.value : undefined;
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

  isRequiredDataMissing(): boolean {
    // @ts-ignore
    return (
      this.name?.errors?.required ||
      this.eventType?.errors?.required ||
      (this.eventType?.value === 'QUEUE_SIZE' && this.queueSize?.errors?.required));
  }

  close(): void {
    this.dialogRef.close();
  }

}
