import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from 'src/app/app.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent implements OnInit {
  user: any;
  constructor(
    public dialogRef: MatDialogRef<BookComponent>,
    private dashboardservice: DashboardService,
    private appservice: AppService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.data.item.quantity = 0;
    this.data.item.config.forEach((con: any) => {
      con.selected = false;
    });
    this.data.item.addons.forEach((add: any) => {
      add.selected = false;
    });
  }
  close() {
    this.dialogRef.close();
  }
  increase(item: any) {
    if (item.quantity === undefined || item.quantity === null) {
      item.quantity = 0;
    } else {
      item.quantity++;
    }
  }
  decrease(item: any) {
    if (item.quantity === undefined || item.quantity === null) {
      item.quantity = 0;
    } else {
      if (item.quantity !== 0) {
        item.quantity--;
      }
    }
  }
  additemtocart(item: any) {
    let configcount = 0;
    item.config.forEach((element: any) => {
      if (element.selected) configcount++;
    });
    if (configcount > 1) {
      this.appservice.alerttop('Cannot select more than one config!', '');
    } else if (item.quantity == 0) {
      this.appservice.alerttop('Please provide item quantity!', '');
    } else {
      // SEND TO CART
      let config: any,
        addons: any = [];
      let data = {
        itemid: item._id,
        quantity: item.quantity,
        name: item.name,
        config: {},
        addons: [],
        price: item.price,
      };
      if (configcount > 0) {
        item.config.forEach((element: any) => {
          if (element.selected)
            config = {
              id: element._id,
              name: element.name,
              price: element.price,
            };
        });
        data.config = config;
      }
      if (item.addons.length > 0) {
        item.addons.forEach((element: any) => {
          if (element.selected)
            addons.push({
              id: element._id,
              name: element.name,
              price: element.price,
            });
        });
        data.addons = addons;
      }

      this.dashboardservice.addToCart(data);
      this.appservice.alerttop('Added item to cart!', '');
      this.close();
    }
  }
}
