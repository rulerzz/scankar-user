import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { DashboardService } from '../dashboard.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  user: any;
  ruser: any;
  show: boolean;
  /**
   * Sliding animation time
   * @type number
   * @default .4
   */
  @Input() transitionDuration = 0.4;

  /**
   * Percentage of the content to move on each slide
   * @type number
   * @field value between 0.1 - 1 with the aspect of container width
   */
  @Input() slidePercentage = 0.8;
  constructor(
    private dashboardservice: DashboardService,
    private appservice: AppService,
    private router: Router
  ) {
    this.user = {};
    this.ruser = {};
    this.show = false;
  }
  options: AnimationOptions = {
    path: '../../../assets/empty1.json',
  };
  options2: AnimationOptions = {
    path: '../../../assets/empty3.json',
  };
  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }
  ngOnInit(): void {
    this.load();
  }
  load() {
    this.appservice.load();
    this.dashboardservice.getalldata(localStorage.getItem('id')).subscribe(
      (data) => {
        this.user = data.body.data.user[0];
        this.dashboardservice.getalldata(localStorage.getItem('rid')).subscribe(
          (datax) => {
            this.ruser = datax.body.data.user[0];
            if (this.ruser.categories == undefined || this.ruser.categories == null || this.ruser.categories.length == 0) {
              this.show = true;
            }
            this.appservice.unload();
          },
          (err) => {
            this.appservice.unload();
            this.appservice.alert('Could not get categories!', '');
          }
        );
      },
      (err) => {
        this.appservice.unload();
        this.appservice.alert('Could not get categories!', '');
      }
    );
  }
  showItems(category: any) {
    localStorage.setItem('selectedCategory', JSON.stringify(category));
    this.router.navigate(['dashboard/items']);
  }
}
