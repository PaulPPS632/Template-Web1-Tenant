import { Injectable } from '@angular/core';
import { UserInfo } from '../models/user-info';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  CompraResponse,
  RegistrarCompraRequest,
} from '../models/compra-request';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RegistroCompraService {
  private readonly Url = environment.API_URL + '/facturacion/compra';
  headersAuthorization: HttpHeaders;
  headers: HttpHeaders;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.headers = this.authService.getHeaders();
    this.headersAuthorization = this.authService.getHeadersAuthorization();
  }
  user: UserInfo = {
    id: '',
    sub: '',
    name: '',
    given_name: '',
    family_name: '',
    picture: '',
    email: '',
    email_verified: false,
    locale: '',
    password: '',
    tenantId: '',
    tenantName: '',
    regist: false,
    tiponegocio: '',
    rol: null,
  };

  registrar(compraRequest: RegistrarCompraRequest): Observable<any> {
    compraRequest.usuario_id = JSON.parse(localStorage.getItem('User')!).id;
    return this.http.post<any>(this.Url, compraRequest, {
      headers: this.headers,
    });
  }

  getCompra(id: string): Observable<RegistrarCompraRequest> {
    return this.http.get<RegistrarCompraRequest>(`${this.Url}/${id}`, {
      headers: this.headers,
    });
  }

  Listar(): Observable<CompraResponse[]> {
    return this.http.get<CompraResponse[]>(this.Url, { headers: this.headers });
  }
  getpagedCompra(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.Url}?page=${page}&size=${pageSize}`, {
      headers: this.headers,
    });
  }
}
