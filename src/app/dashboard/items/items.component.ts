import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { BookComponent } from '../book/book.component';
import { DashboardService } from '../dashboard.service';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})
export class ItemsComponent implements OnInit {
  selectedCategory: any;
  show: boolean;
  constructor(
    private dashboardservice: DashboardService,
    private appservice: AppService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.selectedCategory = JSON.parse(
      localStorage.getItem('selectedCategory')
    );
    this.show = false;
  }

  ngOnInit(): void {
     if (
       this.selectedCategory.items == undefined ||
       this.selectedCategory.items == null ||
       this.selectedCategory.items.length == 0
     ) {
       this.show = true;
     }
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
  addItem(item: any) {
    const dialogRef = this.dialog.open(BookComponent, {
      width: '350px',
      height: '450px',
      data: {
        item: item,
        selectedCategory: this.selectedCategory,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
