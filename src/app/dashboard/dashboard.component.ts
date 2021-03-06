import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { config } from '../../config/config';
import { AppService } from '../app.service';
import { DashboardService } from './dashboard.service';
import { NguCarouselConfig } from '@ngu/carousel';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BookComponent } from './book/book.component';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
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
  mode = 'over';
  backdrop = true;
  opened: boolean;
  links: any;
  rid: string;
  showanim: boolean;
  constructor(
    private route: ActivatedRoute,
    private dashboardservice: DashboardService,
    private appservice: AppService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.showanim = true;
    this.config = config;
    this.results = [];
    this.links = [
      {
        link: 'categories',
        text: 'Home',
        download: false,
        icon: 'feather-list',
      },
      {
        link: 'orders',
        text: 'Orders',
        download: false,
        icon: 'feather-navigation',
      },
      {
        link: 'profile',
        text: 'Profile',
        download: false,
        icon: 'feather-user',
      },
      {
        link: 'combos',
        text: 'Combos',
        download: false,
        icon: 'feather-codepen',
      },
      {
        link: 'cart',
        text: 'Cart',
        download: false,
        icon: 'feather-shopping-cart',
      },
      {
        link: 'offers',
        text: 'Offers',
        download: false,
        icon: 'feather-cloud-snow',
      },
    ];
    this.dashboardservice.setuserupdatedevent$.forEach((event) => {
      this.ngOnInit();
    });
  }

  ngOnInit(): void {
    this.rid = localStorage.getItem('rid');
    this.appservice.load();
    this.dashboardservice.getUser(localStorage.getItem('id')).subscribe(
      (data) => {
        this.appservice.unload();
        this.user = data.body.data.user;
        this.dashboardservice.setuser(this.user);
        localStorage.setItem('firstName', this.user.firstName);
      },
      (err) => {
        this.appservice.unload();
        this.appservice.alert('Could not fetch account data!', '');
      }
    );
    if (this.rid !== null) {
      this.showanim = false;
      this.showcategories();
    }
  }
  options: AnimationOptions = {
    path: '../../../assets/8531-qr.json',
  };
  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }
  showcategories() {
    this.router.navigate(['dashboard/categories']);
  }
  showitems() {
    this.router.navigate(['dashboard/items']);
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
        item: item,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem('id');
    localStorage.removeItem('time');
    this.router.navigate(['']);
  }
}
