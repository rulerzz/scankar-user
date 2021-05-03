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
  orderid: any;
  orderToEdit: any;
  constructor(
    private dashboardservice: DashboardService,
    private appservice: AppService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.cart = [];
    this.username = localStorage.getItem('firstName');
    this.discount = 0;
    this.orderType = localStorage.getItem('orderType');
    this.tableNo = localStorage.getItem('tableNo');
    this.total = 0;
    this.address = '';
    this.instruction = '';
    this.orderid = this.route.snapshot.paramMap.get('id');
    this.dashboardservice.setcartevent$.forEach((event) => {
      this.initcart();
    });
  }

  ngOnInit(): void {
    this.appservice.load();
    this.dashboardservice.getalldata(localStorage.getItem('rid')).subscribe(
      (data) => {
        this.appservice.unload();
        this.user = data.body.data.user[0];
        this.initcart();
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
  initcart() {
    this.cart = this.dashboardservice.getCart();
    this.orderToEdit = JSON.parse(localStorage.getItem('orderToEdit'));
    this.getTotalCost();
    if (this.orderToEdit !== null) {
      this.address = this.orderToEdit.address;
    }
  }
  getPrice(item: any) {
    if (item.hasOwnProperty('config') && item.config.hasOwnProperty('price'))
      return item.config.price;
    else return item.price;
  }
  getName(item: any) {
    if (item.hasOwnProperty('config')) return item.config.name;
    else return 'Initial';
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
      if (element.offer === undefined)
        total += Number(this.getFinalPrice(element));
    });
    let offer: any = JSON.parse(localStorage.getItem('offer'));
    if (offer !== null) {
      total += Number(offer?.price);
    }
    total -= this.discount;
    this.total = total.toFixed(2);
  }
  complete() {
    if (this.user.takeawaystatus === false && this.orderType === 'Take Home') {
      this.appservice.alert("Take Away orders cannot be taken at this time!", "");
    }
    else if (this.user.deliverstatus === false && this.orderType === 'Delivery') {
      this.appservice.alert("Delivery orders cannot be taken at this time!", "");
    }
    else {
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
                userId: localStorage.getItem('id'),
                discount: this.discount,
                price: this.total,
                booker: this.username,
                tableNo: this.tableNo,
                roomNo: 0,
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
                  localStorage.removeItem('selectedOffer');
                },
                (err) => {
                  this.appservice.unload();
                  this.appservice.alerttop('Error completing order!', '');
                }
              );
            }
          } else {
            this.appservice.alerttop(
              'This table already has an order running!',
              ''
            );
          }
        });
      } else if (this.orderType == 'Delivery') {
        // TAKE AWAY / DELIVERY
        this.tableNo = 0;
        if (this.address === '') {
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
            roomNo: 0,
            user: localStorage.getItem('rid'),
            userId: localStorage.getItem('id'),
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
              localStorage.removeItem('selectedOffer');
            },
            (err) => {
              this.appservice.unload();
              this.appservice.alerttop('Error completing order!', '');
            }
          );
        }
      } else if (this.orderType == 'Take Home') {
        this.tableNo = 0;
        this.appservice.load();
        let order = {
          discount: this.discount,
          items: this.cart,
          price: this.total,
          booker: this.username,
          tableNo: this.tableNo,
          roomNo: 0,
          user: localStorage.getItem('rid'),
          placed_time: new Date().toString(),
          userId: localStorage.getItem('id'),
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
            localStorage.removeItem('selectedOffer');
          },
          (err) => {
            this.appservice.unload();
            this.appservice.alerttop('Error completing order!', '');
          }
        );
      } else {
        this.appservice.alerttop('Please select order type!', '');
      }
    }
  }
  update() {
    this.orderToEdit.items = this.cart;
    this.orderToEdit.price = this.total;
    this.orderToEdit.address = this.address;
    this.dashboardservice.UpdateOrder(this.orderToEdit).subscribe((data) => {
      this.cart = [];
      this.dashboardservice.setCart([]);
      localStorage.removeItem('orderToEdit');
      this.appservice.alerttop('Updated order successfully!', '');
      this.router.navigate(['dashboard/categories']);
    }, (err) => {
      this.appservice.alerttop('Could not update order!', '');
    });
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
  decrease(item: any) {
    if (item.quantity != 0) {
      item.quantity--;
      this.dashboardservice.setCart(this.cart);
      this.getTotalCost();
    }
  }
  increase(item: any) {
    item.quantity++;
    this.dashboardservice.setCart(this.cart);
    this.getTotalCost();
  }
  delete(item: any) {
    console.log(item);
    let index = this.cart.findIndex((obj) => obj.itemid == item.itemid);
    this.cart.splice(index, 1);
    this.dashboardservice.setCart(this.cart);
    this.getTotalCost();
  }
}
