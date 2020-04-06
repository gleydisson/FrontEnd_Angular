import { LogoutService } from './logout.service';
import { AuthGuard } from 'app/seguranca/auth.guard';
import { AuthService } from './auth.service';
import { MoneyHttp } from './money-http';
import { Http, RequestOptions } from '@angular/http';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SegurancaRoutingModule } from './seguranca-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './login-form/login-form.component';
import { FormsModule } from '@angular/forms';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

export function authHttpServiceFactory(auth: AuthService, http: Http, options: RequestOptions) {
  const config = new AuthConfig({
    globalHeaders: [
      { 'Content-Type': 'application/json' }
    ]
  });
  return new MoneyHttp(auth, config, http, options);
}

@NgModule({
  imports: [
    CommonModule,
    SegurancaRoutingModule,
    FormsModule,
    ButtonModule,
    InputTextModule
  ],
  declarations: [LoginFormComponent],
  providers: [ {
    provide: AuthHttp,
    useFactory: authHttpServiceFactory,
    deps: [AuthService, Http, RequestOptions]
  },
    AuthGuard,
    LogoutService
]
})
export class SegurancaModule { }
