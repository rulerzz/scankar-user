import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../../config/config';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any;
  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post<any>(config.serverUrl + 'userlogin', data, {
      observe: 'response',
    });
  }
  register(data: any): Observable<any> {
    return this.http.post<any>(config.serverUrl + 'userregister', data, {
      observe: 'response',
    });
  }
  sendotp(data: any): Observable<any> {
    return this.http.post<any>(config.serverUrl + 'sendotp', data, {
      observe: 'response',
    });
  }
  checkuser(data: any): Observable<any> {
    return this.http.post<any>(config.serverUrl + 'checkuser', data, {
      observe: 'response',
    });
  }
  getUser() {
    return this.user;
  }
  setUser(user: any) {
    this.user = user;
  }
  verifyotp(phone: any, otp: any) {
    return this.http.get<any>(
      'https://sms.smsmenow.in/validateOtpApi.jsp?mobileno=+91' +
        phone +
        '&otp=' +
        otp,
      {
        observe: 'response',
      }
    );
  }
  otplogin(phone: any): Observable<any> {
    return this.http.post<any>(config.serverUrl + 'otplogin', { phone : phone}, {
      observe: 'response',
    });
  }
}
