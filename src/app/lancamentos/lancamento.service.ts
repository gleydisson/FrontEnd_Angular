import { AuthHttp } from 'angular2-jwt';
import { Lancamento } from './../core/model';
import { Headers, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { promise } from 'protractor';

import 'rxjs/add/operator/toPromise';
import * as moment from 'moment';

export class LancamentoFiltro {
  descricao: string;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  pagina = 0;
  itensPorPagina = 5;

}

@Injectable()
export class LancamentoService {

  lancamentosURL = 'http://localhost:8080/lancamento';

  constructor(private http: AuthHttp) { }

  pesquisar(filtro: any): Promise<any> {
    const params = new URLSearchParams();
   // const headers = new Headers()
   // headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')

    params.set('page', filtro.pagina.toString());
    params.set('size', filtro.itensPorPagina.toString());

    if (filtro.descricao) {
      params.set('descricao', filtro.descricao);
    }

    if (filtro.dataVencimentoInicio) {
      params.set('dataVencimentoDe',
      moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
    }
    if (filtro.dataVencimentoAte) {
      params.set('dataVencimentoAte',
      moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
    }
  return  this.http.get(`${this.lancamentosURL}?resumo`,
      { search: params })
      .toPromise()
      .then(response => {
        const responseJson = response.json();
        const lancamentos = responseJson.content;

        const resultado = {
          lancamentos,
          total: responseJson.totalElements
        };
        return resultado;
      })

  }

excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.lancamentosURL}/${codigo}`)
    .toPromise()
    .then(() => null);
}

adicionar(lancamento: Lancamento):  Promise<Lancamento> {
 /* const headers = new Headers()
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==')
    headers.append('Content-type', 'application/json')
*/
  return this.http.post(this.lancamentosURL, JSON.stringify(lancamento))
  .toPromise()
  .then(response => response.json());
}


atualizar(lancamento: Lancamento): Promise<Lancamento> {
/*  const headers = new Headers();
  headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
  headers.append('Content-Type', 'application/json');
*/
  return this.http.put(`${this.lancamentosURL}/${lancamento.codigo}`,
      JSON.stringify(lancamento))
    .toPromise()
    .then(response => {
      const lancamentoAlterado = response.json() as Lancamento;

      this.converterStringsParaDatas([lancamentoAlterado]);

      return lancamentoAlterado;
    });
}

buscarPorCodigo(codigo: number): Promise<Lancamento> {
 /* const headers = new Headers();
  headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
*/
  return this.http.get(`${this.lancamentosURL}/${codigo}`)
    .toPromise()
    .then(response => {
      const lancamento = response.json() as Lancamento;

      this.converterStringsParaDatas([lancamento]);

      return lancamento;
    });
}

private converterStringsParaDatas(lancamentos: Lancamento[]) {
  for (const lancamento of lancamentos) {
    lancamento.dataVencimento = moment(lancamento.dataVencimento,
      'YYYY-MM-DD').toDate();

    if (lancamento.dataPagamento) {
      lancamento.dataPagamento = moment(lancamento.dataPagamento,
        'YYYY-MM-DD').toDate();
    }
  }
}

}

