import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CotizacionService {
  private readonly Url = environment.API_URL + '/facturacion/cotizacion';
  headersAuthorization: HttpHeaders;
  headers: HttpHeaders;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.headers = this.authService.getHeaders();
    this.headersAuthorization = this.authService.getHeadersAuthorization();
  }
  registrar(ventaRequest: any): Observable<any> {
    ventaRequest.usuario_id = JSON.parse(localStorage.getItem('User')!).id;
    return this.http.post<any>(this.Url, ventaRequest, {
      headers: this.headers,
    });
  }
  getPagedCotizaciones(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.Url}?page=${page}&size=${pageSize}`, {
      headers: this.headers,
    });
  }
  getCotizacionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.Url}/${id}`, { headers: this.headers });
  }
}
