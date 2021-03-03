import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-callwaiter',
  templateUrl: './callwaiter.component.html',
  styleUrls: ['./callwaiter.component.css'],
})
export class CallwaiterComponent implements OnInit {
  tableNo : any;
  orderType: string;
  constructor(
    private dashboardservice : DashboardService,
    private appservice : AppService
  ) {
    this.orderType = localStorage.getItem('orderType');
  }

  ngOnInit(): void {}

  makeabellcall(){
    this.dashboardservice
      .sendping(localStorage.getItem('rid'), localStorage.getItem('tableNo'))
      .subscribe(
        (data) => {
          this.appservice.alerttop('Waiter Pinged!', '');
        },
        (err) => {
          this.appservice.alerttop('Could not ping!', '');
        }
      );
  }
}
