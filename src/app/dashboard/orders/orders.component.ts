import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  orders: any;
  completed: any;
  cancelled: any;
  inprogress: any;
  constructor(
    private dashboardservice: DashboardService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.cancelled = [];
    this.completed = [];
    this.inprogress = [];
  }
  ngOnInit(): void {
    this.dashboardservice.getOrderList(localStorage.getItem('id')).subscribe(
      (data) => {
        this.orders = data.body.orders;
        this.orders.forEach((element) => {
          if (element.process === 'Pending' || element.process === 'Running') {
            this.inprogress.push(element);
          }
          if (
            element.process === 'Completed' ||
            element.process === 'Delivered'
          ) {
            this.completed.push(element);
          }
          if (element.process === 'Rejected') {
            this.cancelled.push(element);
          }
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }
  reorder(order: any) {
    this.dashboardservice.setCart(order.items);
    this.router.navigate(['dashboard/cart']);
  }
  edit(order: any) {
    let dialog = this.dialog.open(ConfirmdialogComponent, {
      width: '350px',
    });
    dialog.afterClosed().subscribe((result) => {
      if (result == true) {
        this.dashboardservice.setCart(order.items);
        localStorage.setItem('orderToEdit', JSON.stringify(order));
        this.router.navigate(['dashboard/cart/' + order._id]);
      }
    });
  }
}
