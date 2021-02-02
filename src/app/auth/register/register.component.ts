import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  password: FormControl;
  email: FormControl;
  phone: FormControl;
  firstname: FormControl;
  lastname: FormControl;
  constructor(
    private router: Router,
    private appservice: AppService,
    private authservice: AuthService
  ) {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.firstname = new FormControl('', Validators.required);
    this.lastname = new FormControl('', Validators.required);
    this.phone = new FormControl('', Validators.required);
    this.password = new FormControl('', Validators.required);
  }

  ngOnInit(): void {}

  register() {
    this.authservice
      .register({
        firstName: this.firstname.value,
        lastName: this.lastname.value,
        email: this.email.value,
        mobileNumber: this.phone.value,
        password: this.password.value,
        passwordConfirm: this.password.value,
        role: 'user',
        status: 'Active',
      })
      .subscribe(
        (data) => {
          this.appservice.alert('Account created successfully!', '');
        },
        (err) => {
            this.appservice.alert('Error creating account, check credentials!', '');
        }
      );
  }
  login() {
    this.router.navigate(['login']);
  }
}
