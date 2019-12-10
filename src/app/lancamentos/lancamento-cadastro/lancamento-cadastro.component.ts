import { ToastyService } from 'ng2-toasty';
import { LancamentoService } from './../lancamento.service';
import { FormControl } from '@angular/forms';
import { Lancamento } from './../../core/model';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { PessoasService } from './../../pessoas/pessoas.service';
import { CategoriasService } from './../../categoria/categorias.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css']
})
export class LancamentoCadastroComponent implements OnInit {

  tipos = [
    {label: 'Receita', value:'RECEITA'},
    {label: 'Despesa', value:'DESPESA'},
  ];

  categorias = [];

  pessoas = [
  /*  { label: 'Gleydisson Bona', value: 1 },
    { label: 'Juliana Bona', value: 2 },
    { label: 'Eliana Bona', value: 3 },*/
  ];

  lancamento = new Lancamento();

  constructor(private categoriasService: CategoriasService,
              private errorHandle: ErrorHandlerService,
              private pessoaService: PessoasService,
              private lancamentoService: LancamentoService,
              private toasty: ToastyService,
              private route: ActivatedRoute,
              private router: Router,
              private title: Title) { }

  ngOnInit() {

    const codigoLancamento = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo Lancamento');

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  get editando() {
    return Boolean(this.lancamento.codigo);
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
    .then(lancamento => {
      this.lancamento = lancamento;
      this.atualizarTituloEdicao();
    })
    .catch(erro => this.errorHandle.handle(erro));

  }

salvar(form: FormControl) {
  if(this.editando) {
    this.atualizarLancamento(form);
  }else {
    this.adicionarLancamento(form);
  }
}

  adicionarLancamento(form: FormControl) {
    this.lancamentoService.adicionar(this.lancamento)
    .then(lancamentoAdicionado => {
      this.toasty.success('Lancamento adicionado com sucesso!');

     // form.reset();
     // this.lancamento = new Lancamento();
      this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);

    })
    .catch(erro => this.errorHandle.handle(erro));
  }

  atualizarLancamento(form: FormControl) {
    this.lancamentoService.atualizar(this.lancamento)
    .then(lancamento => {
      //Boa pratica colocar a seguinte linha(Atualiza tudo igual do BackEnd), mas sem a mesma iria funcionar.
      this.lancamento = lancamento;

      this.toasty.success('Alterado com Sucesso!');
      this.atualizarTituloEdicao();
    })
    .catch(erro => this.errorHandle.handle(erro));
  }

  carregarCategorias() {
    return this.categoriasService.listarTodas()
    .then(categorias => {
      this.categorias = categorias.map(c => {
        return { label: c.nome, value: c.codigo };
      });

    })
    .catch(erro => this.errorHandle.handle(erro));
  }

  carregarPessoas() {
    this.pessoaService.listarTodas()
      .then(pessoas => {
        this.pessoas = pessoas
          .map(p => ({ label: p.nome, value: p.codigo }));
      })
      .catch(erro => this.errorHandle.handle(erro));
  }

  novo(form: FormControl) {
    form.reset();

    setTimeout(function() {
    this.lancamento = new Lancamento();
  }.bind(this), 1)
    this.router.navigate(['/lancamentos/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edicao de lancamento: ${this.lancamento.descricao}`);
  }

}
