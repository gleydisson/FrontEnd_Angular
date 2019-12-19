import { ToastyService } from 'ng2-toasty';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
//import { AuthHttpError } from 'angular2-jwt';
import { Router } from '@angular/router';
import { NotAuthenticatedError } from 'app/seguranca/money-http';

@Injectable()
export class ErrorHandlerService {

  constructor(private toasty: ToastyService, private router: Router) { }

handle(errorResponse: any) {
  let msg: string;

  if(typeof errorResponse === 'string'){
    msg = errorResponse;
  } else if (errorResponse instanceof NotAuthenticatedError) {
    msg = 'Sua sessao expirou!';
    this.router.navigate(['/login']);

  } else if (errorResponse instanceof Response
    && errorResponse.status >= 400 && errorResponse.status <= 499) {
  let errors;
  msg = 'Ocorreu um erro ao processar a sua solicitação';

  if(errorResponse.status === 403) {
    msg = 'Voce nao tem permissao para executar essa acao!'
  }

  try {
    errors = errorResponse.json();

    msg = errors[0].mensagemUsuario;
  } catch (e) { }

  console.error('Ocorreu um erro', errorResponse);

  }else {
    msg = 'Erro ao processar servico remoto. Tente novamente.';
    console.log('Ocorreu um erro', errorResponse);
  }

  this.toasty.error(msg);
}

}
