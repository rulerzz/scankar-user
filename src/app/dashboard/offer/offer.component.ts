import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { AppService } from 'src/app/app.service';
import { BookComponent } from '../book/book.component';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-offer',
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {

  selectedOffer: any;
  show: boolean;
  categories: any;
  offers: any = [];
  constructor(
    private dashboardservice: DashboardService,
    private appservice: AppService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.selectedOffer = JSON.parse(
      localStorage.getItem('selectedOffer')
    );
    console.log(this.selectedOffer)
    this.show = false;
  }

  ngOnInit(): void {
    if (
      this.selectedOffer?.items == undefined ||
      this.selectedOffer?.items == null ||
      this.selectedOffer?.items?.length == 0
    ) {
      this.show = true;
    }
    this.dashboardservice.offers(localStorage.getItem('rid')).subscribe((data)=>{
      this.offers = data.body.offers;
    });
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
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
  showItems(category){
    this.selectedOffer = category;
    if(this.selectedOffer.items.length == 0){
      this.show = true;
    }
    else{
      this.show = false;
    }
  }
  showOffer(offer:any){
    localStorage.setItem('selectedOffer', JSON.stringify(offer));
    this.router.navigate(['dashboard/offer']);
  }
  additemstocart(){
    localStorage.setItem('offer',JSON.stringify(this.selectedOffer));
    this.selectedOffer.items.forEach(element => {
      element.quantity = 1;
      element.offer = true;
      this.additemtocart(element);
    });
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
      if(item.offer){
        data['offer'] = true;
      }
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
    }
  }

}
