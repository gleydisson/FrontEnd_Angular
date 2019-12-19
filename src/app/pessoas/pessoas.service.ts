import { environment } from './../../environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { Pessoa } from './../core/model';
import { URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable()
export class PessoasService {

  pessoasURL: string;

  constructor(private http: AuthHttp) {
    this.pessoasURL = `${environment.apiUrl}/pessoas`;
  }

  pesquisar(filtro: PessoaFiltro): Promise<any> {

    const params = new URLSearchParams();

    params.set('page', filtro.pagina.toString());
    params.set('size', filtro.itensPorPagina.toString());

    if (filtro.nome) {
      params.set('nome', filtro.nome);
    }

    return this.http.get(`${this.pessoasURL}`, { search: params})
    .toPromise()
    .then(response => {
      const responseJson = response.json();
      const pessoas = responseJson.content;

      const resultado = {
        pessoas,
        total: responseJson.totalElements
      };
      return resultado;
    })
  }

  listarTodas(): Promise<any> {
    return this.http.get(this.pessoasURL)
      .toPromise()
      .then(response => response.json().content);
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.pessoasURL}/${codigo}`)
    .toPromise()
    .then(() => null);
  }

  mudarStatus(codigo: number, ativo: boolean): Promise<void> {

    return this.http.put(`${this.pessoasURL}/${codigo}/ativo`, ativo)
    .toPromise()
    .then(() => null);
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {

    return this.http.post(this.pessoasURL, JSON.stringify(pessoa))
    .toPromise()
    .then(response => response.json());
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
  /*  const headers = new Headers()
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
    headers.append('content-type', 'application/json');
*/
    return this.http.put(`${this.pessoasURL}/${pessoa.codigo}`,
      JSON.stringify(pessoa))
      .toPromise()
      .then(response => {
        const PessoaAlterado = response.json() as Pessoa;

        return PessoaAlterado;
      });
  }

  buscarPorCodigo(codigo: number): Promise<Pessoa> {
    return this.http.get(`${this.pessoasURL}/ ${codigo}`)
    .toPromise()
    .then(response => {
      const pessoa = response.json() as Pessoa;

      return pessoa;
    })
  }

}
