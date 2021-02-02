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
      this.appservice.alerttop(
        'You can only select one configuration at a time!',
        ''
      );
    } else if (configcount == 0) {
      this.appservice.alerttop('You must select one configuration at least!', '');
    } else if (item.quantity == 0) {
      this.appservice.alerttop('Please provide item quantity!', '');
    } else {
      // SEND TO CART
      let config: any,
        addons: any = [];
      item.config.forEach((element: any) => {
        if (element.selected)
          config = {
            id: element._id,
            name: element.name,
            price: element.price,
          };
      });
      item.addons.forEach((element: any) => {
        if (element.selected)
          addons.push({
            id: element._id,
            name: element.name,
            price: element.price,
          });
      });
      let data = {
        itemid: item._id,
        quantity: item.quantity,
        config: config,
        addons: addons,
        name: item.name,
      };
      this.dashboardservice.addToCart(data);
      this.appservice.alerttop('Added item to cart!','');
      this.close();
    }
  }
}
