import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-action',
  standalone: true,
  imports: [],
  templateUrl: './confirm-action.component.html',
  styleUrl: './confirm-action.component.scss',
})
export class ConfirmActionComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmActionComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      text: string;
      confirmIcon: string;
      confirmText: string;
    }
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
