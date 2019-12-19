import { AuthService } from './../seguranca/auth.service';
import { RouterModule } from '@angular/router';
import { PessoasService } from './../pessoas/pessoas.service';
import { LancamentoService } from './../lancamentos/lancamento.service';
import { CategoriasService } from './../categoria/categorias.service';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfirmDialogModule } from 'primeng/components/confirmdialog/confirmdialog';
import { ToastyModule } from 'ng2-toasty';


import { ErrorHandlerService } from './error-handler.service';
import { NavbarComponent } from './navbar/navbar.component';
import { ConfirmationService } from 'primeng/components/common/api';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';
import { Title } from '@angular/platform-browser';
import { SegurancaModule } from 'app/seguranca/seguranca.module';
import { JwtHelper } from 'angular2-jwt';
import { NaoAutorizadoComponent } from './nao-autorizado.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    ToastyModule.forRoot(),
    ConfirmDialogModule,
  ],
  declarations: [ NavbarComponent, PaginaNaoEncontradaComponent, NaoAutorizadoComponent ],
  exports: [
    NavbarComponent,
    ToastyModule,
    ConfirmDialogModule,
    SegurancaModule
  ],
  providers: [
    LancamentoService, PessoasService, ConfirmationService, CategoriasService,
    ErrorHandlerService, Title, AuthService, JwtHelper
  ]
})
export class CoreModule { }
