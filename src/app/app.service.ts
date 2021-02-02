import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  constructor(
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {}

  log(message: any) {
    console.log(message);
  }
  alert(message: string, action: string) {
    if (action == '') {
      action = 'close';
    }
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }
  alerttop(message: string, action: string) {
    if (action == '') {
      action = 'close';
    }
    this._snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
  load() {
    this.spinner.show();
  }
  unload() {
    this.spinner.hide();
  }
}
