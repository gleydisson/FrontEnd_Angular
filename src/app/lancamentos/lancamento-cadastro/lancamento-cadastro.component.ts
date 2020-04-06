import { ToastyService } from 'ng2-toasty';
import { LancamentoService } from './../lancamento.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
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

  //lancamento = new Lancamento(); // Era usado antes do formulario Reativo.
  formulario: FormGroup // Formulario Reativo

  uploadEmAndamento = false;

  constructor(private categoriasService: CategoriasService,
              private errorHandle: ErrorHandlerService,
              private pessoaService: PessoasService,
              private lancamentoService: LancamentoService,
              private toasty: ToastyService,
              private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.configurarFormulario();
    const codigoLancamento = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo Lancamento');

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }


  antesUploadAnexo(event) {
    event.xhr.setRequestHeader('Authorization', 'Bearer' + localStorage.getItem('token'));

    this.uploadEmAndamento = true;
  }

  aoTerminarUploadAnexo(event){
    const anexo = JSON.parse(event.xhr.response);

    this.formulario.patchValue({
      anexo: anexo.nome,
      urlanexo: anexo.url
    });
    this.uploadEmAndamento = false;
  }

  erroUpload(event) {
    this.toasty.error('Erro ao tentar enviar anexo!');
    this.uploadEmAndamento = false;
  }

  get nomeAnexo() {
    const nome = this.formulario.get('anexo').value;

    if(nome) {
      return nome.substring( nome.indexOf('_') + 1, nome.length);
    }
    return '';
  }

  get urlUploadAnexo(){
    return this.lancamentoService.urlUploadAnexo();
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      tipo: [ 'RECEITA', Validators.required ],
      dataVencimento: [null, Validators.required],
      dataPagamento: [],
      descricao: [null, [this.validarObrigatoriedade, this.validarTamanhoMinimo(5)]],
      valor: [null, Validators.required],
      pessoa: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: []
      }),
      categoria: this.formBuilder.group({
        codigo: [ null, Validators.required ],
        nome: []
      }),
      observacao: [],
      anexo: [],
      urlanexo: []
    });
  }

  validarObrigatoriedade(input: FormControl){
    return (input.value ? null : { obrigatoriedade: true })
  }

  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return (!input.value || input.value.length >= valor) ? null : {tamanhoMinimo: {tamanho: valor}}
    }
  }

  get editando() {
    return Boolean(this.formulario.get('codigo').value);
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService.buscarPorCodigo(codigo)
    .then(lancamento => {
      //this.lancamento = lancamento;
      this.formulario.patchValue(lancamento)
      this.atualizarTituloEdicao();
    })
    .catch(erro => this.errorHandle.handle(erro));

  }

salvar() {
  if(this.editando) {
    this.atualizarLancamento();
  }else {
    this.adicionarLancamento();
  }
}

  adicionarLancamento() {
    this.lancamentoService.adicionar(this.formulario.value)
    .then(lancamentoAdicionado => {
      this.toasty.success('Lancamento adicionado com sucesso!');

     // form.reset();
     // this.lancamento = new Lancamento();
      this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);

    })
    .catch(erro => this.errorHandle.handle(erro));
  }

  atualizarLancamento() {
    this.lancamentoService.atualizar(this.formulario.value)
    .then(lancamento => {
      //Boa pratica colocar a seguinte linha(Atualiza tudo igual do BackEnd), mas sem a mesma iria funcionar.
      //this.lancamento = lancamento;
      this.formulario.patchValue(lancamento)
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

  novo() {
    this.formulario.reset();

    setTimeout(function() {
    this.lancamento = new Lancamento();
  }.bind(this), 1)
    this.router.navigate(['/lancamentos/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edicao de lancamento: ${this.formulario.get('descricao').value}`);
  }

}
