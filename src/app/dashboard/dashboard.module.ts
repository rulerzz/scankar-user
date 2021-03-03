import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { BookComponent } from './book/book.component';
import { CategoriesComponent } from './categories/categories.component';
import { ItemsComponent } from './items/items.component';
import { CartComponent } from '../cart/cart.component';
import { SharedModule } from '../shared.module';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { OverflowCarouselModule } from '@nghacks/overflow-carousel';
import player from 'lottie-web';
import { LottieModule } from 'ngx-lottie';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { OffersComponent } from './offers/offers.component';
import { CombosComponent } from './combos/combos.component';
import { ProfileComponent } from './profile/profile.component';
import { NgxFlickingModule } from '@egjs/ngx-flicking';
import { DragScrollModule } from 'ngx-drag-scroll';
import { FooterComponent } from './footer/footer.component';
import { MainfooterComponent } from './mainfooter/mainfooter.component';
import { HeaderComponent } from './header/header.component';
import { CallwaiterComponent } from './callwaiter/callwaiter.component';
import { OrdersComponent } from './orders/orders.component';
import { FaqComponent } from './faq/faq.component';
import { HelpComponent } from './help/help.component';
import { ConfirmdialogComponent } from './confirmdialog/confirmdialog.component';
export function playerFactory() {
  return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'categories',
        component: CategoriesComponent,
      },
      {
        path: 'items',
        component: ItemsComponent,
      },
      {
        path: 'orders',
        component: OrdersComponent,
      },
      {
        path: 'faq',
        component: FaqComponent,
      },
      {
        path: 'help',
        component: HelpComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'cart/:id',
        component: CartComponent,
      },
      {
        path: 'offers',
        component: OffersComponent,
      },
      {
        path: 'combos',
        component: CombosComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    BookComponent,
    CategoriesComponent,
    ItemsComponent,
    OffersComponent,
    CombosComponent,
    ProfileComponent,
    FooterComponent,
    MainfooterComponent,
    HeaderComponent,
    CallwaiterComponent,
    OrdersComponent,
    FaqComponent,
    HelpComponent,
    ConfirmdialogComponent
  ],
  providers: [DashboardService],
  imports: [
    IvyCarouselModule,
    OverflowCarouselModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    LottieModule.forRoot({ player: playerFactory }),
    NgxFlickingModule,
    DragScrollModule,
  ],
  exports: [
    DashboardComponent,
    BookComponent,
    CategoriesComponent,
    ItemsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {}
