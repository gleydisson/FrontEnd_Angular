import { environment } from './../../environments/environment';
import { AuthHttp } from 'angular2-jwt';
import { Injectable } from '@angular/core';


import 'rxjs/add/operator/toPromise';

@Injectable()
export class CategoriasService {

  categoriasUrl: string;

  constructor(private http: AuthHttp) {
    this.categoriasUrl = `${environment.apiUrl}/categorias`;
  }

  listarTodas(): Promise<any> {
   /* const headers = new Headers();
    headers.append('Authorization', 'Basic YWRtaW5AYWxnYW1vbmV5LmNvbTphZG1pbg==');
*/
    return this.http.get(this.categoriasUrl)
      .toPromise()
      .then(response => response.json());
  }

}
