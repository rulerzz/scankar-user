import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { CustomValidationMessages } from 'src/app/custom/custom-validation-messages';
import { CustomValidators } from 'src/app/custom/CustomValidators';
import { config } from '../../../config/config';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public userLoginForm: FormGroup;
  public userOtpForm: FormGroup;
  public formErrors = DOMError;
  public validationMessages = CustomValidationMessages.validationMessages;
  public formErrorMsg = '';
  config: any;
  loginflag: boolean;
  otpflag: boolean;
  otp: any;
  enteredOtp: any;
  constructor(
    private router: Router,
    private appservice: AppService,
    private authservice: AuthService,
    private fb: FormBuilder
  ) {
    this.config = config;
    if (localStorage.getItem('token')) {
      this.router.navigate(['dashboard']);
    }
  }

  ngOnInit(): void {
    this.checkUserExist();

    this.initialiseUserLoginForm();

    this.userLoginForm.valueChanges.subscribe((data) =>
      this.logValidationErrors(this.userLoginForm)
    );
  }

  login() {
    this.appservice.load();
    if (!this.isFormValid()) return;

    const apiData = {
      user: this.userLoginForm.value.userName,
      password: this.userLoginForm.value.password,
    };
    this.authservice.login(apiData).subscribe(
      (data) => {
        this.appservice.unload();
        if (data.body.user[0].status === 'InActive') {
          this.appservice.alert('Your login has not been authorized!', '');
        } else {
          let date = new Date();
          this.appservice.alert(
            'Hello ' +
              data.body.user[0].firstName +
              ' ' +
              data.body.user[0].lastName +
              ' 🙋',
            ''
          );
          localStorage.setItem('token', data.body.token);
          localStorage.setItem('role', data.body.user[0].role);
          localStorage.setItem('email', data.body.user[0].email);
          localStorage.setItem('id', data.body.user[0]._id);
          localStorage.setItem('time', date.toJSON());
          this.router.navigate(['dashboard']);
        }
      },
      (err) => {
        this.appservice.unload();
        console.log(err);
        this.appservice.alert(err, '');
      }
    );
  }
  forget() {
    this.router.navigate(['forgotpassword']);
  }
  signup() {
    this.router.navigate(['register']);
  }
  checkUserExist() {
    if (localStorage.getItem('rid') === null) return;

    this.router.navigate(['/']);
  }
  initialiseUserLoginForm() {
    this.userLoginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, CustomValidators.spaceValidator]],
    });
    this.userOtpForm = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
    });
  }
  isFormValid() {
    this.userLoginForm.markAllAsTouched();
    this.logValidationErrors();

    if (this.userLoginForm.invalid)
      this.appservice.alert(this.formErrorMsg, '');
    return this.userLoginForm.valid;
  }

  logValidationErrors(group: FormGroup = this.userLoginForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl: AbstractControl = group.get(key);

      this.formErrors[key] = '';
      if (
        abstractControl &&
        !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)
      ) {
        const msg = this.validationMessages[key];

        for (const errorKey in abstractControl.errors) {
          if (errorKey) this.formErrors[key] = msg[errorKey] + ' ';
        }
      }

      if (abstractControl instanceof FormGroup)
        this.logValidationErrors(abstractControl);
    });

    for (const key in this.formErrors) {
      if (this.formErrors[key]) {
        this.formErrorMsg =
          'Error in ' +
          key.replace(/_/g, ' ').toUpperCase() +
          ' field: ' +
          this.formErrors[key];
        return;
      }
    }
  }
  loginfromphone() {
    this.loginflag = !this.loginflag;
  }
  loginbyotp() {
    if (!this.otpflag) this.sendotp();
  }
  sendotp() {
    this.appservice.load();
    this.otpflag = !this.otpflag;
    this.authservice.sendotp({ phone: this.userOtpForm.value.phone }).subscribe(
      (data) => {
        this.appservice.alert('OTP sent!', '');
        this.otp = data.body.otp;
        this.appservice.unload();
      },
      (err) => {
        this.appservice.alert('Error sending OTP!', '');
        this.appservice.unload();
      }
    );
  }
  verifyotpandlogin() {
    this.appservice.load();
    this.authservice.verifyotp(this.userOtpForm.value.phone , this.enteredOtp).subscribe((data) => {
      if(data.body.result === "success"){
        this.appservice.alert("OTP matched successfully! Loggin In!", "");
        this.authservice.otplogin(this.userOtpForm.value.phone).subscribe(
          (data) => {
            this.appservice.unload();
            if (data.body.user[0].status === 'InActive') {
              this.appservice.alert('Your login has not been authorized!', '');
            } else {
              let date = new Date();
              this.appservice.alert('Logged In! 🙋', '');
              localStorage.setItem('token', data.body.token);
              localStorage.setItem('role', data.body.user[0].role);
              localStorage.setItem('id', data.body.user[0]._id);
              localStorage.setItem('time', date.toJSON());
              this.router.navigate(['dashboard']);
            }
          },
          (err) => {
            this.appservice.unload();
            this.appservice.alert(err, '');
          }
        );
      }
      if(data.body.result === "fail"){
        this.appservice.unload();
        this.appservice.alert("OTP does not match! Please try again!", "");
      }
    }, (err) => {
      this.appservice.unload();
      this.appservice.alert("OTP Validation service not available!","");
    })
  }
  onOtpChange($event){
    if($event.length == 6){
      this.enteredOtp = $event;
      this.verifyotpandlogin();
    }
  }
}
