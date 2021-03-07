import { AppService } from './app.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EMPTY } from 'rxjs';
@Injectable()
export class AppInterceptor implements HttpInterceptor {
  logged: any;
  currentTime: any;
  constructor(
    private _snackBar: MatSnackBar,
    private router: Router,
    private appservice: AppService
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.includes('login') || req.url.includes('register')) {
      return next.handle(req);
    } else {
      let fromdate = localStorage.getItem('time')
        ? localStorage.getItem('time')
        : '';
      if (fromdate) this.logged = new Date(fromdate);
      this.currentTime = new Date();
      let hours = Math.abs(this.currentTime - this.logged) / 36e5;
      if (hours > 3) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('id');
        localStorage.removeItem('time');
        this.router.navigate(['login']);
        return next.handle(req);
      } else {
        if (localStorage.getItem('token') == null) {
          this.router.navigate(['login']);
          return next.handle(req);
        } else {
          req = req.clone({
            setHeaders: {
              Authorization: `Bearer ` + localStorage.getItem('token'),
            },
          });
          return next.handle(req);
        }
      }
    }
  }
}
