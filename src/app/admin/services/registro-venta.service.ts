import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistrarVentaRequest, VentaResponse } from '../models/venta-request';
import { UserInfo } from '../models/user-info';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class RegistroVentaService {
  private readonly Url = environment.API_URL + '/facturacion/venta';

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
  registrar(ventaRequest: RegistrarVentaRequest): Observable<any> {
    ventaRequest.usuario_id = JSON.parse(localStorage.getItem('User')!).id;
    return this.http.post<any>(this.Url, ventaRequest, {
      headers: this.headers,
    });
  }
  Listar(): Observable<VentaResponse[]> {
    return this.http.get<VentaResponse[]>(this.Url, { headers: this.headers });
  }
  getVenta(id: string): Observable<RegistrarVentaRequest> {
    return this.http.get<RegistrarVentaRequest>(`${this.Url}/${id}`, {
      headers: this.headers,
    });
  }
  getpagedVenta(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.Url}?page=${page}&size=${pageSize}`, {
      headers: this.headers,
    });
  }
}
