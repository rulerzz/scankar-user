import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmdialog',
  templateUrl: './confirmdialog.component.html',
  styleUrls: ['./confirmdialog.component.css'],
})
export class ConfirmdialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ConfirmdialogComponent>) {}

  ngOnInit(): void {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  yes(){
    this.dialogRef.close(true);
  }
}
