import { AuthService } from './auth.service';
import { SharedModule } from './../shared.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { NgOtpInputModule } from 'ng-otp-input';
const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'forgotpassword',
        component: ForgotPasswordComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
    ],
  }
];

@NgModule({
  declarations: [
    AuthComponent,
    LoginComponent,
    ForgotPasswordComponent,
    RegisterComponent,
  ],
  imports: [SharedModule, RouterModule.forChild(routes), NgOtpInputModule],
  providers: [AuthService],
  exports: [
    AuthComponent,
    LoginComponent,
    ForgotPasswordComponent,
    RegisterComponent,
  ],
})
export class AuthModule {}
