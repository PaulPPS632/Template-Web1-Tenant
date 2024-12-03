import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from '../../data-access/base-http.service';
import { Observable } from 'rxjs';
import { ProductoResponse } from '../../../admin/models/producto-response';
import { AuthService } from '../../../admin/services/auth.service';

//const LIMIT = 5;

@Injectable({ providedIn: 'root' })
export class ProductsService extends BaseHttpService {
  /*
  getProducts(page: number): Observable<Product[]> {
    return this.http.get<any[]>(`${this.apiUrl}/producto`, {
      params: {
        limit: page * LIMIT,
      },
    });
  }
  */
  authService = inject(AuthService);

  getProducts(
    page: number,
    search: string,
    size: number,
    sort: string,
    marcas: string,
    categorias: string,
    subcategoria: string,
  ): Observable<ProductoResponse[]> {
    const headers = this.authService.getHeaders();
    //return this.http.get<any[]>(`${this.apiUrl}/inventory/producto`);
    return this.http.get<any[]>(`${this.apiUrl}/inventario/producto/paged`, {
      params: {
        page: page,
        search: search,
        size: size,
        marca: marcas,
        categoria: categorias,
        subcategoria: subcategoria,
        sort: sort,
      },
      headers: headers,
    });
  }

  getProduct(id: string): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      `${this.apiUrl}/inventario/producto/${id}`,
    );
  }
}
