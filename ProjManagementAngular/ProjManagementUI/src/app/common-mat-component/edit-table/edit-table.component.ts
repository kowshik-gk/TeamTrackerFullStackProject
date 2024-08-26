import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-edit-table',
  standalone: true,
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class EditTableComponent {
  dataType: 'project' | 'employee' | 'teamLead' = 'project';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditTableComponent>
  ) {
    if (data.name) {
      this.dataType = 'project';
    } else if (data.employeeName) {
      this.dataType = 'employee';
    } else if (data.tlName) {
      this.dataType = 'teamLead';
    }
  }

  onSave() {
    this.dialogRef.close(this.data);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
