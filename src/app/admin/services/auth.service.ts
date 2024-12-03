import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { map, Observable, tap } from 'rxjs';
import { TenantService } from './tenant.service';
import { Tenant } from '../models/Tenant';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl: string = environment.API_URL + '/tenant/entidad';
  tenant: Tenant | null = null;
  constructor(
    private http: HttpClient,
    private tenantService: TenantService,
  ) {
    this.tenantService.tenant$.subscribe((tenantInfo: Tenant | null) => {
      this.tenant = tenantInfo;
    });
  }

  register(registerRequest: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}`, registerRequest, {
        headers: this.getHeaders(),
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('rol', response.rol);
          localStorage.setItem('User', response.username);
        }),
      );
  }

  isLoggedIn(): Observable<any> {
    const request = {
      token: localStorage.getItem('authToken'),
    };
    return this.http
      .post<any>(`${this.apiUrl}/validate`, request, {
        headers: this.getHeaders(),
      })
      .pipe(
        map((res) => ({
          estado: res.estado,
          rol: res.rol,
          usuario: res.usuario,
        })),
      );
  }

  Logged(email: string, password: string): Observable<any> {
    const loginRequest = {
      email,
      password,
    };
    return this.http.post<any>(`${this.apiUrl}/login`, loginRequest, {
      headers: this.getHeaders(),
    });
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getHeadersAuthorization(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
      tenantid: this.tenant?.id || '', // Utilizar el valor del tenantId capturado
    });
  }
  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      tenantid: this.tenant?.id || '',
    });
  }
}
