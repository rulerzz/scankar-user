import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { config } from '../../config/config';
import { AppService } from '../app.service';
import { BookComponent } from '../dashboard/book/book.component';
import { DashboardService } from '../dashboard/dashboard.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cart: any[];
  discount: any;
  addedDiscount = false;
  username: any;
  tableNo: any;
  numbers: any;
  orderType: any;
  total: any;
  instruction: any;
  address: any;
  user: any;
  constructor(
    private dashboardservice: DashboardService,
    private appservice: AppService,
    private router: Router
  ) {
    this.cart = [];
    this.username = localStorage.getItem('firstName');
    this.discount = 0;
    this.orderType = localStorage.getItem('orderType');
    this.tableNo = localStorage.getItem('tableNo');
    this.total = 0;
    this.address = "";
    this.instruction = "";
  }

  ngOnInit(): void {
    this.appservice.load();
    this.dashboardservice.getalldata(localStorage.getItem('rid')).subscribe(
      (data) => {
        this.appservice.unload();
        this.user = data.body.data.user[0];
        this.cart = this.dashboardservice.getCart();
        this.getTotalCost();
      },
      (err) => {
        this.appservice.unload();
        this.appservice.alerttop('Could not get categories!', '');
      }
    );
  }
  ngOnDestroy() {
    this.cart = [];
    this.total = 0;
  }
  getPrice(item: any) {
    if (item.config.hasOwnProperty('price')) return item.config.price;
    else return item.price;
  }
  getAddonAmount(item: any) {
    let price = 0;
    item.addons.forEach((element: any) => {
      price += element.price;
    });
    return price;
  }
  getCgst(item: any) {
    let cgst = 0;
    let price = this.getPrice(item);
    let addon = this.getAddonAmount(item);
    let total = price + addon;
    cgst = (total / 100) * this.user.cgst;
    return cgst.toFixed(2);
  }
  getSgst(item: any) {
    let sgst = 0;
    let price = this.getPrice(item);
    let addon = this.getAddonAmount(item);
    let total = price + addon;
    sgst = (total / 100) * this.user.sgst;
    return sgst.toFixed(2);
  }
  getServiceCharges(item: any) {
    let service = 0;
    let price = this.getPrice(item);
    let addon = this.getAddonAmount(item);
    let total = price + addon;
    service = (total / 100) * this.user.servicecharge;
    return service.toFixed(2);
  }
  getFinalPrice(item: any) {
    let finalPrice = 0;
    let price = Number(this.getPrice(item));
    let addon = Number(this.getAddonAmount(item));
    let cgst = Number(this.getCgst(item));
    let sgst = Number(this.getSgst(item));
    let servicecharge = Number(this.getServiceCharges(item));
    finalPrice = price + addon;
    if (this.user.servicechargeenable) {
      finalPrice += servicecharge;
    }
    if (this.user.enablecgst) {
      finalPrice += cgst;
    }
    if (this.user.enablesgst) {
      finalPrice += sgst;
    }
    return (finalPrice * item.quantity).toFixed(2);
  }
  getTotalCost() {
    let total = 0;
    this.cart.forEach((element) => {
      total += Number(this.getFinalPrice(element));
    });
    total -= this.discount;
    this.total = total.toFixed(2);
  }
  complete() {
    if (
      this.discount == '' ||
      this.discount == null ||
      this.discount == undefined
    ) {
      this.discount = 0;
    }
    if (this.orderType == 'Dine In') {
      // DINE IN
      this.dashboardservice.getorderattable(this.tableNo).subscribe((data) => {
        if (data.body.data.length == 0) {
          if (this.tableNo == 0) {
            this.appservice.alerttop('Please select a valid table!', '');
          } else {
            this.appservice.load();
            let order = {
              items: this.cart,
              discount: this.discount,
              price: this.total,
              booker: this.username,
              tableNo: this.tableNo,
              user: localStorage.getItem('rid'),
              placed_time: new Date().toString(),
              status: 'Placed',
              process: 'Pending',
              instruction: this.instruction,
              orderType: this.orderType,
              address: this.address,
            };
            this.dashboardservice.completeorder(order).subscribe(
              (data) => {
                this.appservice.unload();
                this.dashboardservice.setCart([]);
                this.appservice.alerttop('Order Placed!', '');
                this.router.navigate(['dashboard/categories']);
              },
              (err) => {
                this.appservice.unload();
                this.appservice.alerttop('Error completing order!', '');
              }
            );
          }
        } else {
          this.appservice.alerttop('This table already has an order running!', '');
        }
      });
    } else if (this.orderType == 'Delivery') {
      // TAKE AWAY / DELIVERY
      this.tableNo = 0;
      if (this.address === "") {
        console.log(this.address);
        this.appservice.alerttop('Please enter address!', '');
      } else {
        this.appservice.load();
        let order = {
          discount: this.discount,
          items: this.cart,
          price: this.total,
          booker: this.username,
          tableNo: this.tableNo,
          user: localStorage.getItem('rid'),
          placed_time: new Date().toString(),
          status: 'Placed',
          process: 'Pending',
          instruction: this.instruction,
          orderType: this.orderType,
          address: this.address,
        };
        this.dashboardservice.completeorder(order).subscribe(
          (data) => {
            this.appservice.unload();
            this.dashboardservice.setCart([]);
            this.appservice.alerttop('Order Placed!', '');
            this.router.navigate(['dashboard/categories']);
          },
          (err) => {
            this.appservice.unload();
            this.appservice.alerttop('Error completing order!', '');
          }
        );
      }
    } else if (this.orderType == 'Take Home') {
      this.tableNo = 0;
      if (this.address === "") {
        this.appservice.alerttop('Please enter address!', '');
      } else {
        this.appservice.load();
        let order = {
          discount: this.discount,
          items: this.cart,
          price: this.total,
          booker: this.username,
          tableNo: this.tableNo,
          user: localStorage.getItem('rid'),
          placed_time: new Date().toString(),
          status: 'Placed',
          process: 'Pending',
          instruction: this.instruction,
          orderType: this.orderType,
          address: this.address,
        };
        this.dashboardservice.completeorder(order).subscribe(
          (data) => {
            this.appservice.unload();
            this.dashboardservice.setCart([]);
            this.appservice.alerttop('Order Placed!', '');
            this.router.navigate(['dashboard/categories']);
          },
          (err) => {
            this.appservice.unload();
            this.appservice.alerttop('Error completing order!', '');
          }
        );
      }
    } else {
      this.appservice.alerttop('Please select order type!', '');
    }
  }
  applydiscount() {
    this.total = (this.total - this.discount).toFixed(2);
    this.addedDiscount = true;
  }
  reset() {
    this.discount = 0;
    this.getTotalCost();
    this.addedDiscount = false;
  }
}
