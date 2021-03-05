import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from '../../config/config';
import { AppService } from '../app.service';
import { DashboardService } from '../dashboard/dashboard.service';
import * as EmailValidator from 'email-validator';
import { AuthService } from './auth.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  config: any;
  user: FormControl;
  password: FormControl;
  query: any;
  routedata: any;
  userId: any;
  orderType: string;
  tableNumber: string;
  constructor(
    private route: ActivatedRoute,
    private dashboardservice: DashboardService,
    private appservice: AppService,
    private router: Router,
    private authservice: AuthService
  ) {
    this.config = config;
    this.route.params.subscribe((params) => {
      if (params.id === "cart") {
        this.router.navigate(['cart']);
      } else {
        this.query = params.id;
        if (params.id !== undefined) {
          this.routedata = this.query.split('T');
          if(this.routedata.length < 2){
            // THE PARAMS DOESNT MATCH PATTERN
            console.log("INVALID QR DATA");
            this.appservice.alert("Invalid QR, scan QR again!", "");
          }
          else{
            // ALL GOOD
            this.userId = this.routedata[0];
            if (this.routedata[1] == 'A') {
              this.orderType = 'Take Home';
            } else if (this.routedata[1] == 'L') {
              this.orderType = 'Delivery';
            } else {
              this.orderType = 'Dine In';
              this.tableNumber = this.routedata[1];
              localStorage.setItem('tableNo', this.tableNumber);
            }
            localStorage.setItem('rid', this.userId);
            localStorage.setItem('orderType', this.orderType);
          }
          this.router.navigate(['login']);
        }
      }
    });
  }

  ngOnInit(): void {}
}
