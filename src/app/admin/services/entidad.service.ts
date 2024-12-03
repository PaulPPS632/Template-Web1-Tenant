import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Entidad } from '../models/entidad-response';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EntidadService {
  apiUrl: string = environment.API_URL + '/tenant/entidad';
  headersAuthorization: HttpHeaders;
  headers: HttpHeaders;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.headers = this.authService.getHeaders();
    this.headersAuthorization = this.authService.getHeadersAuthorization();
  }

  getEntidades(): Observable<Entidad[]> {
    return this.http.get<Entidad[]>(this.apiUrl, {
      headers: this.headers,
    });
  }

  postEntidad(entidad: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, entidad, {
      headers: this.headers,
    });
  }

  search(searchText: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search?search=${searchText}`, {
      headers: this.headers,
    });
  }
}
