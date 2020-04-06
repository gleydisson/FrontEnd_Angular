import { RelatorioLancamentosComponent } from './relatorios/relatorio-lancamentos/relatorio-lancamentos.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { NaoAutorizadoComponent } from './core/nao-autorizado.component';
import { NgModule } from '@angular/core';
import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada.component';
import { PessoaCadastroComponent } from './pessoas/pessoa-cadastro/pessoa-cadastro.component';
import { PessoasPesquisaComponent } from './pessoas/pessoas-pesquisa/pessoas-pesquisa.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'pessoas', component: PessoasPesquisaComponent },
  { path: 'pessoas/novo', component: PessoaCadastroComponent },
  { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent },
  { path: 'nao-autorizado', component: NaoAutorizadoComponent },
  { path: 'dashboard', component: DashboardComponent },
  {path: 'relatorios/lancamentos',  component: RelatorioLancamentosComponent},
  { path: '**', redirectTo: 'pagina-nao-encontrada' }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoundingModule { }
