import { Component, OnInit } from '@angular/core';
import { config } from '../../../config/config';
@Component({
  selector: 'app-mainfooter',
  templateUrl: './mainfooter.component.html',
  styleUrls: ['./mainfooter.component.css']
})
export class MainfooterComponent implements OnInit {
  config: any;
  constructor() {
    this.config = config;
   }

  ngOnInit(): void {
  }

}
