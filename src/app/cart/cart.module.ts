import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared.module';
const routes: Routes = [
  {
    path: '',
    component: CartComponent,
  },
];


@NgModule({
  declarations: [CartComponent],
  imports: [CommonModule, SharedModule, RouterModule.forChild(routes)],
  exports: [CartComponent]
})
export class CartModule {}
