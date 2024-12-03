import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ArchivosService {
  apiUrl: string = environment.API_URL + '/archivos';
  headersAuthorization: HttpHeaders;
  headers: HttpHeaders;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.headers = this.authService.getHeaders();
    this.headersAuthorization = this.authService.getHeadersAuthorization();
  }

  getImagenesPublicitarias(): Observable<{ [key: string]: string[] }> {
    return this.http.get<{ [key: string]: string[] }>(
      this.apiUrl + '/publicitaria',
      {
        headers: this.headers,
      },
    );
  }

  postarchivo(imagenespublicitarias: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, imagenespublicitarias, {
      headers: this.headersAuthorization,
    });
  }
  postarchivoPublicitaria(imagenespublicitarias: FormData): Observable<any> {
    return this.http.post<any>(
      'http://localhost:3004/publicitaria',
      imagenespublicitarias,
      {
        headers: this.headers,
      },
    );
  }
  deleteArchivo(url: string): Observable<any> {
    return this.http.delete<any>(
      `${environment.API_URL}` + '/inventory/archivos/',
      {
        headers: this.headersAuthorization,
        body: { url: url }, // Usar 'body' para incluir la información a eliminar
      },
    );
  }
}
