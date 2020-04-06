import { DropdownModule } from 'primeng/dropdown';
import { PanelModule } from 'primeng/panel';
import { PessoasRoutingModule } from './pessoas-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { InputMaskModule } from 'primeng/inputmask';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PessoasPesquisaComponent } from './pessoas-pesquisa/pessoas-pesquisa.component';
import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { PessoaCadastroContatoComponent } from './pessoa-cadastro-contato/pessoa-cadastro-contato.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    DropdownModule,

    InputTextModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    InputMaskModule,
    PanelModule,
    DialogModule,
    SharedModule,
    PessoasRoutingModule
  ],
  declarations: [PessoaCadastroComponent, PessoasPesquisaComponent, PessoaCadastroContatoComponent],
  exports: []
})
export class PessoasModule { }
