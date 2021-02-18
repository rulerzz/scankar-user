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
  categories: any;
  constructor(
    private dashboardservice: DashboardService,
    private appservice: AppService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.selectedCategory = JSON.parse(
      localStorage.getItem('selectedCategory')
    );
    this.categories = JSON.parse(localStorage.getItem('categories'));
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
    path: '../../../assets/empty.json',
  };
  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }
  addItem(item: any) {
    const dialogRef = this.dialog.open(BookComponent, {
      width: '350px',
      data: {
        item: item,
        selectedCategory: this.selectedCategory,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  showItems(category){
    this.selectedCategory = category;
    if(this.selectedCategory.items.length == 0){
      this.show = true;
    }
    else{
      this.show = false;
    }
  }
}
