import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoSerieResponse } from '../models/producto-serie-response';
import { Observable } from 'rxjs';
import { ProductoResponse } from '../models/producto-response';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductoSerieService {
  apiUrl: string = environment.API_URL + '/inventario/productoserie';
  headersAuthorization: HttpHeaders;
  headers: HttpHeaders;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.headers = this.authService.getHeaders();
    this.headersAuthorization = this.authService.getHeadersAuthorization();
  }
  getListaProductoSerie(): Observable<ProductoSerieResponse[]> {
    return this.http.get<ProductoSerieResponse[]>(this.apiUrl);
  }
  getProductoSerie(serie: string): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(`${this.apiUrl}/belong/${serie}`, {
      headers: this.headers,
    });
  }

  getSeriesByProductoId(
    id_producto: string | null | undefined,
  ): Observable<ProductoSerieResponse[]> {
    return this.http.get<ProductoSerieResponse[]>(
      `${this.apiUrl}/stock/${id_producto}`,
      { headers: this.headers },
    );
  }
  delete(sn: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${sn}`, {
      headers: this.headers,
    });
  }
}
