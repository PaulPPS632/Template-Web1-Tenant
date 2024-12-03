import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private readonly Url = environment.API_URL + '/inventario/pedidos';
  headersAuthorization: HttpHeaders;
  headers: HttpHeaders;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.headers = this.authService.getHeaders();
    this.headersAuthorization = this.authService.getHeadersAuthorization();
  }
  registrar(pedidoRequest: any): Observable<void> {
    return this.http.post<void>(this.Url, pedidoRequest, {
      headers: this.headers,
    });
  }
  listar(): Observable<any> {
    return this.http.get<any>(this.Url, { headers: this.headers });
  }
  getPedidosByUsername(id: string): Observable<any> {
    return this.http.get<any>(`${this.Url}/${id}`, { headers: this.headers });
  }
  aplicarcambio(id: string, estado: string): Observable<void> {
    return this.http.put<void>(
      `${this.Url}`,
      { id: id, estado: estado },
      {
        headers: this.headers,
      },
    );
  }
}
