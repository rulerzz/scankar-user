import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}
  showcart() {
    this.router.navigate(['dashboard/cart']);
  }
  goHome() {
    this.router.navigate(['dashboard/categories']);
  }
  showCombos() {
    this.router.navigate(['dashboard/combos']);
  }
  showOffers() {
    this.router.navigate(['dashboard/offer']);
  }
  showProfile() {
    this.router.navigate(['dashboard/profile']);
  }
}
