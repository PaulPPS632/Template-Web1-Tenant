import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipadoDocumentos } from '../models/tipado-documentos';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TipadoService {
  private Url = environment.API_URL + '/facturacion/tipado';
  headersAuthorization: HttpHeaders;
  headers: HttpHeaders;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.headers = this.authService.getHeaders();
    this.headersAuthorization = this.authService.getHeadersAuthorization();
  }

  getTipadoDocumentos(): Observable<TipadoDocumentos> {
    return this.http.get<TipadoDocumentos>(this.Url, { headers: this.headers });
  }

  private informacionSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null,
  );

  enviarInformacion(informacion: any): void {
    this.informacionSubject.next(informacion);
  }

  obtenerInformacion(): Observable<any> {
    return this.informacionSubject.asObservable();
  }
}
