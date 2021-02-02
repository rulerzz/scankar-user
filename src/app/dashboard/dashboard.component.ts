import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { config } from '../../config/config';
import { AppService } from '../app.service';
import { DashboardService } from './dashboard.service';
import { NguCarouselConfig } from '@ngu/carousel';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BookComponent } from './book/book.component';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  config: any;
  user: any;
  ruser: any;
  photo:any;
  firstName:any;
  constructor(
    private route: ActivatedRoute,
    private dashboardservice: DashboardService,
    private appservice: AppService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.config = config;
  }

  ngOnInit(): void {
    this.photo = localStorage.getItem('photo');
    this.firstName = localStorage.getItem('firstName');
    this.showcategories();
  }
  
  showcategories() {
    this.router.navigate(['dashboard/categories']);
  }
  showitems() {
    this.router.navigate(['dashboard/items']);
  }
  showcart() {
    this.router.navigate(['dashboard/cart']);
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }
}
