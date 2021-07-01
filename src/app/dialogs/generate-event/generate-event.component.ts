import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FireEventDto } from '../../models/FireEventDto';
import { IbmqService } from '../../services/ibmq.service';

@Component({
  selector: 'app-generate-event',
  templateUrl: './generate-event.component.html',
  styleUrls: ['./generate-event.component.scss']
})
export class GenerateEventComponent implements OnInit {

  availableDevices: string[] = [];
  loadingDevices: boolean = true;

  form = new FormGroup({
    device: new FormControl('no-devices', [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ]),
    eventType: new FormControl(this.data.eventType ? this.data.eventType : 'QUEUE_SIZE', [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ]),
    replyTo: new FormControl(this.data.replyTo ? this.data.replyTo : 'JOB.RESULT.QUEUE', [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ]),
    queueSize: new FormControl(this.data.additionalProperties && this.data.additionalProperties.queueSize ? this.data.additionalProperties.queueSize : undefined, [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: FireEventDto,
              private ibmqService: IbmqService,
              private dialogRef: MatDialogRef<GenerateEventComponent>) {
  }

  ngOnInit(): void {
    if (!this.data.additionalProperties) {
      this.data.additionalProperties = {};
    }

    this.ibmqService.getAvailableDevices().subscribe(response => {
      this.loadingDevices = false;
      this.availableDevices = response ? response : [];

      if (this.availableDevices.length > 0) {
        this.device?.setValue(this.availableDevices[0]);
      }
    });

    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.device = this.device ? this.device.value : undefined;
      this.data.eventType = this.eventType ? this.eventType.value : undefined;
      this.data.replyTo = this.replyTo ? this.replyTo.value : undefined;
      if (this.data.eventType === 'QUEUE_SIZE') {
        this.data.additionalProperties.queueSize = this.queueSize ? this.queueSize.value : undefined;
      }
    });
  }

  get device(): AbstractControl | null {
    return this.form ? this.form.get('device') : null;
  }

  get eventType(): AbstractControl | null {
    return this.form ? this.form.get('eventType') : null;
  }

  get replyTo(): AbstractControl | null {
    return this.form ? this.form.get('replyTo') : null;
  }

  get queueSize(): AbstractControl | null {
    return this.form ? this.form.get('queueSize') : null;
  }

  isRequiredDataMissing(): boolean {
    // @ts-ignore
    return (
      this.availableDevices.length === 0 ||
      this.device?.errors?.required ||
      this.eventType?.errors?.required ||
      this.replyTo?.errors?.required ||
      (this.eventType?.value === 'QUEUE_SIZE' && this.queueSize?.errors?.required));
  }

  close(): void {
    this.dialogRef.close();
  }

}
