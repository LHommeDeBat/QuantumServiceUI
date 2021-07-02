import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-application',
  templateUrl: './add-quantum-application.component.html',
  styleUrls: ['./add-quantum-application.component.scss']
})
export class AddQuantumApplicationComponent implements OnInit {

  form = new FormGroup({
    name: new FormControl(this.data.name, [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ]),
    file: new FormControl(this.data.name, [
      // eslint-disable-next-line @typescript-eslint/unbound-method
      Validators.required
    ])
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dialogRef: MatDialogRef<AddQuantumApplicationComponent>) {
  }

  ngOnInit(): void {
    this.dialogRef.beforeClosed().subscribe(() => {
      this.data.name = this.name ? this.name.value : undefined;
      this.data.file = this.file ? this.file.value : undefined;
    });
  }

  get name(): AbstractControl | null {
    return this.form ? this.form.get('name') : null;
  }

  get file(): AbstractControl | null {
    return this.form ? this.form.get('file') : null;
  }

  isRequiredDataMissing(): boolean {
    // @ts-ignore
    return (this.name.errors?.required || this.file.errors?.required);
  }

  close(): void {
    this.dialogRef.close();
  }

}

export interface DialogData {
  title: string;
  name: string;
  file: any;
}
