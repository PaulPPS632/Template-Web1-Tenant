import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MarcaResponse } from '../models/marca-response';
import { CategoriaMarcaResponse } from '../models/categoriamarca-response';
import { MarcaRequest } from '../models/marca-request';
import { CategoriaMarcaRequest } from '../models/categoriamarca-request';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class MarcaService {
  apiUrl: string = environment.API_URL + '/inventario/marca';
  Url: string = environment.API_URL + '/inventario/categoriamarca';
  headersAuthorization: HttpHeaders;
  headers: HttpHeaders;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.headers = this.authService.getHeaders();
    this.headersAuthorization = this.authService.getHeadersAuthorization();
  }

  getAll(): Observable<MarcaResponse[]> {
    return this.http.get<MarcaResponse[]>(this.apiUrl, {
      headers: this.headers,
    });
  }

  postMarca(categoria: MarcaRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, categoria, {
      headers: this.headers,
    });
  }

  postCategoriaMarca(categoriaMarca: CategoriaMarcaRequest): Observable<any> {
    return this.http.post<any>(`${this.Url}`, categoriaMarca, {
      headers: this.headers,
    });
  }

  getSubs(id: number): Observable<CategoriaMarcaResponse[]> {
    return this.http.get<CategoriaMarcaResponse[]>(
      `${this.apiUrl}/subs/${id}`,
      { headers: this.headers },
    );
  }
}
