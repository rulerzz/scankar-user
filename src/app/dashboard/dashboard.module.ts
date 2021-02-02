import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { BookComponent } from './book/book.component';
import { ItemlistComponent } from './itemlist/itemlist.component';
import { CategoriesComponent } from './categories/categories.component';
import { ItemsComponent } from './items/items.component';
import { CartComponent } from '../cart/cart.component';
import { SharedModule } from '../shared.module';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { OverflowCarouselModule } from '@nghacks/overflow-carousel';
import player from 'lottie-web';
import { LottieModule } from 'ngx-lottie';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

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
        path: 'cart',
        component: CartComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    BookComponent,
    ItemlistComponent,
    CategoriesComponent,
    ItemsComponent,
  ],
  providers: [DashboardService],
  imports: [
    IvyCarouselModule,
    OverflowCarouselModule,
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
    LottieModule.forRoot({ player: playerFactory }),
  ],
  exports: [
    DashboardComponent,
    BookComponent,
    ItemlistComponent,
    CategoriesComponent,
    ItemsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardModule {}
