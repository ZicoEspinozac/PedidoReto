// src/app/services/orders/orders.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Interfaz para representar la estructura de una orden
export interface Order {
  id?: string;
  customerId: string; // ID del cliente
  customer: string; // Nombre del cliente
  price: number; // Precio total de la orden
  quantity: number; // Cantidad total de productos en la orden
  status: string; // Estado de la orden
  products: Array<{
    id: string; // ID del producto
    name: string; // Nombre del producto
    price: number; // Precio del producto
    stock: number; // Cantidad de ese producto en la orden
  }>;
  totalPrice?: number; // Arreglo que contiene información sobre los productos
}


export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'http://localhost:8080/api/orders'; // Cambia esto por la URL de tu API de órdenes
  private productsUrl = 'http://localhost:8080/api/products'; // Cambia esto por la URL de tu API de productos
  private customersUrl = 'http://localhost:8080/api/customers'; // Cambia esto por la URL de tu API de clientes

  constructor(private http: HttpClient) {}

  // Obtener todas las órdenes
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Crear una nueva orden
  createOrder(orderData: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderData).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar una orden existente
  updateOrder(id: string, orderData: Order): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${id}`, orderData).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar una orden por ID
  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener todos los productos
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener todos los clientes
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.customersUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  // En orders.service.ts
  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`).pipe(
      catchError(this.handleError)
    );
  }

}