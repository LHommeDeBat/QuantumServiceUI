import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventDto } from '../../models/EventDto';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl(this.data.name ? this.data.name : '', [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ]),
    type: new FormControl(this.data.type ? this.data.type : 'QUEUE_SIZE', [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ]),
    queueSize: new FormControl(this.data.additionalProperties && this.data.additionalProperties.queueSize ? this.data.additionalProperties.queueSize : undefined, [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: EventDto,
              private dialogRef: MatDialogRef<AddEventComponent>) {
  }

  ngOnInit(): void {
    if (!this.data.additionalProperties) {
      this.data.additionalProperties = {};
    }

    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.name = this.name ? this.name.value : undefined;
      this.data.type = this.type ? this.type.value : undefined;
      if (this.data.type === 'QUEUE_SIZE') {
        this.data.additionalProperties.queueSize = this.queueSize ? this.queueSize.value : undefined;
      }
    });
  }

  get name(): AbstractControl | null {
    return this.form ? this.form.get('name') : null;
  }

  get type(): AbstractControl | null {
    return this.form ? this.form.get('type') : null;
  }

  get queueSize(): AbstractControl | null {
    return this.form ? this.form.get('queueSize') : null;
  }

  isRequiredDataMissing(): boolean {
    // @ts-ignore
    return (
      this.name?.errors?.required ||
      this.type?.errors?.required ||
      (this.type?.value === 'QUEUE_SIZE' && this.queueSize?.errors?.required));
  }

  close(): void {
    this.dialogRef.close();
  }

}
