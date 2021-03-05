import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { CustomValidationMessages } from 'src/app/custom/custom-validation-messages';
import { AuthService } from '../auth.service';
import { config } from '../../../config/config';
import { CustomValidators } from 'src/app/custom/CustomValidators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public formErrors = DOMError;
  public validationMessages = CustomValidationMessages.validationMessages;
  public formErrorMsg = '';
  config: any;
  constructor(
    private router: Router,
    private appservice: AppService,
    private authservice: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.config = config;
    if (localStorage.getItem('token')) {
      this.router.navigate(['dashboard']);
    }
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      //email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, CustomValidators.spaceValidator]],
    });
  }

  register() {
    this.appservice.load();
    if (!this.isFormValid()) return;

    const apiData = {
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      //email: this.registerForm.value.email,
      mobileNumber: this.registerForm.value.phone,
      passwordConfirm: this.registerForm.value.password,
      password: this.registerForm.value.password,
      ownerType: 'registered',
      role : 'user',
      status : 'Active'
    };
    this.authservice
      .register(apiData)
      .subscribe(
        (data) => {
          this.appservice.alert('Account created successfully!', '');
          this.appservice.unload();
        },
        (err) => {
          console.log(err)
          if (err.error.code?.keyPattern?.email == 1){
            this.appservice.alert('This email is in use!', '');
          }
          else if (err.error.code?.keyPattern?.mobileNumber == 1) {
            this.appservice.alert('This phone number is in use!', '');
          } 
          else if (err.error.code?.errors?.password?.kind === 'minlength') {
            this.appservice.alert(
              'The password must be atleast 8 characters long!',
              ''
            );
          } else if (err.error.code?.errors?.mobileNumber) {
            this.appservice.alert('This phone number is invalid!', '');
          } else if (err.error.code?.errors?.email?.kind === 'regexp') {
            this.appservice.alert('This email is invalid!', '');
          } else {
            this.appservice.alert('Unexpected error!', '');
          }
          this.appservice.unload();
        }
      );
  }
  login() {
    this.router.navigate(['login']);
  }
  isFormValid() {
    this.registerForm.markAllAsTouched();
    this.logValidationErrors();

    if (this.registerForm.invalid) this.appservice.alert(this.formErrorMsg, '');
    return this.registerForm.valid;
  }
  logValidationErrors(group: FormGroup = this.registerForm): void {
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
}
