import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { config } from '../../../config/config';
import { DashboardService } from '../dashboard.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  config: any;
  user: any;
  constructor(private router : Router,
              private dashboardservice : DashboardService) {
    this.config = config;
  }

  ngOnInit() {
    this.dashboardservice.setuserevent$.forEach((event) => {
      this.user = event;
    });
  }

  showProfile() {
    this.router.navigate(['dashboard/profile']);
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }
  showcart() {
    this.router.navigate(['dashboard/cart']);
  }
  checkphoto(){
    if(this.user !== undefined && this.user.hasOwnProperty('photo')){
      return true;
    }
    else{
      return false;
    }
  }
  getName(){
    if (this.user !== undefined && this.user.hasOwnProperty('firstName')) {
      return this.user.firstName;
    } else {
      return "User";
    }
  }
}
