import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-application',
  templateUrl: './add-application.component.html',
  styleUrls: ['./add-application.component.scss']
})
export class AddApplicationComponent implements OnInit {

  file: any;
  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dialogRef: MatDialogRef<AddApplicationComponent>) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(this.data.name, [
        // eslint-disable-next-line @typescript-eslint/unbound-method
        Validators.required
      ])
    });
  }

  get name(): AbstractControl | null {
    return this.form.get('name');
  }

  isRequiredDataMissing(): boolean {
    return (this.name.errors?.required);
  }

  close(): void {
    this.dialogRef.close();
  }

}

export interface DialogData {
  name: string;
}
