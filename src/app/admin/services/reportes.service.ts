import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  apiUrl: string = environment.API_URL + '/facturacion/reportes';
  headersAuthorization: HttpHeaders;
  headers: HttpHeaders;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.headers = this.authService.getHeaders();
    this.headersAuthorization = this.authService.getHeadersAuthorization();
  }
  getVentasReporte(): Observable<any> {
    return this.http.get<any>(this.apiUrl, {
      headers: this.headers,
    });
  }
  getproductosMasVendidos(): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/productos-mas-vendidos', {
      headers: this.headers,
    });
  }
  ProductosStock(): Observable<Blob> {
    return this.http.get(this.apiUrl + '/StockProductos', {
      responseType: 'blob', // Indicamos que la respuesta será un blob
    });
  }
}
