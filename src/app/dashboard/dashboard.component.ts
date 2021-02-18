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
  search: any;
  results: any;
  constructor(
    private route: ActivatedRoute,
    private dashboardservice: DashboardService,
    private appservice: AppService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.config = config;
    this.results = [];
    this.dashboardservice.events$.forEach((event) => {
      if (event) {
        this.ngOnInit();
      }
    });
    if (
      localStorage.getItem('rid') === null ||
      localStorage.getItem('rid') === undefined) {
        localStorage.clear();
        this.appservice.alerttop("Please scan again session expired!", "");
        this.router.navigate(['login']);
    }
  }

  ngOnInit(): void {
    this.appservice.load();
    this.dashboardservice.getUser(localStorage.getItem('id')).subscribe(
      (data) => {
        this.appservice.unload();
        this.user = data.body.data.user;
        localStorage.setItem('firstName', this.user.firstName);
      },
      (err) => {
        this.appservice.unload();
        this.appservice.alert('Could not fetch account data!', '');
      }
    );
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
  goHome() {
    this.router.navigate(['dashboard/categories']);
  }
  showCombos() {
    this.router.navigate(['dashboard/combos']);
  }
  showOffers() {
    this.router.navigate(['dashboard/offers']);
  }
  showProfile() {
    this.router.navigate(['dashboard/profile']);
  }
  changed(search: any) {
    this.appservice.load();
    if (search.length > 2) {
      this.dashboardservice.search(search).subscribe((data) => {
        this.results = data.body.item;
        this.appservice.unload();
      });
    } else {
      this.results = [];
      this.appservice.unload();
    }
  }
  addItem(item: any) {
    const dialogRef = this.dialog.open(BookComponent, {
      width: '350px',
      data: {
        item: item
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
