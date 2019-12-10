import { Pessoa } from './../../core/model';
import { FormControl } from '@angular/forms';
import { PessoasService } from './../pessoas.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { ToastyService } from 'ng2-toasty';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})
export class PessoaCadastroComponent implements OnInit {

  pessoa = new Pessoa();

  constructor(private toasty: ToastyService, private errorHandle: ErrorHandlerService,
              private pessoasService: PessoasService,
              private route: ActivatedRoute,
              private router: Router,
              private title: Title) { }

  ngOnInit() {
  //  console.log(this.route.snapshot.params['codigo']);
  // Metodo serve para verificar se existe codigo da pessoa e mudar a pagina para alteracao de pessoa
     const codigoPessoa = this.route.snapshot.params['codigo'];
     if (codigoPessoa) {
       this.carregarPessoa(codigoPessoa);
     }

     this.title.setTitle('Nova pessoa');
  }

  get editando() {
    return Boolean(this.pessoa.codigo);
  }

  carregarPessoa(codigo: number) {
    this.pessoasService.buscarPorCodigo(codigo)
      .then(pessoa => {
        this.pessoa = pessoa;

        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandle.handle(erro));
  }

  salvar(form: FormControl) {
    if (this.editando) {
      this.atualizarPessoa(form);
    } else {
      this.adicionarPessoa(form);
    }
  }

  adicionarPessoa(form: FormControl) {
    this.pessoasService.adicionar(this.pessoa)
    .then(pessoaAdicionado => {
      this.toasty.success('Pessoa Salvo com sucesso!')

      //form.reset();
      //this.pessoa = new Pessoa();
      this.router.navigate(['/pessoas', pessoaAdicionado.codigo]);

    })
    .catch(erro => this.errorHandle.handle(erro));
  }

  atualizarPessoa(form: FormControl) {
    this.pessoasService.atualizar(this.pessoa)
      .then(pessoa => {
        this.pessoa = pessoa;

        this.toasty.success('Pessoa alterada com Sucesso');
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandle.handle(erro));
  }

  novo(form: FormControl) {
    form.reset()
    this.pessoa = new Pessoa();
    this.router.navigate(['/pessoas/novo']);
  }


  atualizarTituloEdicao(){
    this.title.setTitle(`Edicao de pessoa: ${this.pessoa.nome}`);
  }
}
