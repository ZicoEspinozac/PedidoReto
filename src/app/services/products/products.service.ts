import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private apiUrl = 'http://localhost:8080/api/products'; // Cambia esto por la URL de tu API

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); // Llama a la API para obtener la lista de productos
  }

  createProduct(productData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, productData); // Llama a la API para crear un nuevo producto
  }

  updateProduct(id: number, productData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, productData); // Llama a la API para actualizar un producto
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`); // Llama a la API para eliminar un producto
  }
}
