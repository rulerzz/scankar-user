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
    return this.http.post<any>(config.serverUrl + 'login', data, {
      observe: 'response',
    });
  }
  register(data: any): Observable<any> {
    return this.http.post<any>(config.serverUrl + 'register', data, {
      observe: 'response',
    });
  }
  getUser(){
    return this.user;
  }
  setUser(user:any){
    this.user = user;
  }
}
