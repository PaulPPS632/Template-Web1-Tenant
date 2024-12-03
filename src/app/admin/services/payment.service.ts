import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = environment.API_URL;
  headersAuthorization: HttpHeaders;
  headers: HttpHeaders;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.headers = this.authService.getHeaders();
    this.headersAuthorization = this.authService.getHeadersAuthorization();
  }

  postExternalData(paymentData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/tenant/payment/external-data`,
      JSON.stringify(paymentData),
      { headers: this.headers.append('Content-Type', 'application/json') },
    );
  }
  validatePayment(paymentData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/tenant/payment/validate`,
      paymentData,
      {
        headers: this.headers,
      },
    );
  }
  getPublicKey(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tenant/payment/public-key`, {
      headers: this.headers,
    });
  }
}
