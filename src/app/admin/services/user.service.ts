import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInfo } from '../models/user-info';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl: string = environment.API_URL + '/tenant/entidad';

  constructor(private http: HttpClient) {}
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
  headers = new HttpHeaders({
    Authorization: `Bearer ${localStorage.getItem('authToken')}`,
  });
  getUsuario(): Observable<UserInfo> {
    return this.http.get<UserInfo>(
      `${this.apiUrl}/byusername/${localStorage.getItem('username')}`,
      { headers: this.headers },
    );
  }

  // getUsuariosTenant(): Observable<UserInfo[]> {
  //   return this.http.get<UserInfo[]>(
  //     this.apiUrl + '/tenant/' + this.cookiesService.get('tenantId'),
  //   );
  // }
  // getRoles(): Observable<RolResponse[]> {
  //   const headers = new HttpHeaders({
  //     tenantId: this.cookiesService.get('tenantId'),
  //   });
  //   return this.http.get<RolResponse[]>(this.apiUrl + '/roles', { headers });
  // }
  // getLogica(): Observable<Logica> {
  //   const headers = new HttpHeaders({
  //     tenantId: this.cookiesService.get('tenantId'),
  //   });
  //   const userString = this.cookiesService.get('user');
  //   if (userString) {
  //     try {
  //       this.user = JSON.parse(userString);
  //     } catch (e) {
  //       console.error('Error parsing user cookie:', e);
  //     }
  //   }
  //   return this.http.get<Logica>(this.apiUrl + '/logica/' + this.user.id, {
  //     headers,
  //   });
  // }
  putUsuario(req: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/asignarrol`, req, {
      headers: this.headers,
    });
  }
  getUsuariosDeshboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`, {
      headers: this.headers,
    });
  }
  // deleteUser(usuario: UserInfo): Observable<any> {
  //   const headers = new HttpHeaders({
  //     tenantId: this.cookiesService.get('tenantId'),
  //   });
  //   return this.http.delete(`${this.apiUrl}/${usuario.id}`, { headers });
  // }
  // postNuevoProducto(productoNuevo: FormData): Observable<any> {
  //   const headers = new HttpHeaders({
  //     tenantId: this.cookiesService.get('tenantId'), // Reemplaza con el valor adecuado
  //   });
  //   return this.http.post<any>(`${this.apiUrl}`, productoNuevo, {
  //     headers: headers,
  //   });
  // }

  // deleteProducto(id: string): Observable<void> {
  //   const headers = new HttpHeaders({
  //     tenantId: this.cookiesService.get('tenantId'), // Reemplaza con el valor adecuado
  //   });
  //   return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: headers });
  // }
}
