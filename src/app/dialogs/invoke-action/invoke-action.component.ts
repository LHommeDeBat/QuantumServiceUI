import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FireEventDto } from '../../models/FireEventDto';

@Component({
  selector: 'app-invoke-action',
  templateUrl: './invoke-action.component.html',
  styleUrls: ['./invoke-action.component.scss']
})
export class InvokeActionComponent implements OnInit {

  form = new FormGroup({
    device: new FormControl(this.data.device ? this.data.device : 'ibmq_qasm_simulator', [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ]),
    replyTo: new FormControl(this.data.replyTo ? this.data.replyTo : 'JOB.RESULT.QUEUE', [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ]),
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: InvokeApplicationForm,
              private dialogRef: MatDialogRef<InvokeActionComponent>) {
  }

  ngOnInit(): void {
    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.device = this.device ? this.device.value : undefined;
      this.data.replyTo = this.replyTo ? this.replyTo.value : undefined;
    });
  }

  get device(): AbstractControl | null {
    return this.form ? this.form.get('device') : null;
  }

  get replyTo(): AbstractControl | null {
    return this.form ? this.form.get('replyTo') : null;
  }

  isRequiredDataMissing(): boolean {
    // @ts-ignore
    return (this.device?.errors?.required || this.replyTo?.errors?.required);
  }

  close(): void {
    this.dialogRef.close();
  }
}

export interface InvokeApplicationForm {
  applicationName: string;
  device: string;
  replyTo: string;
}
