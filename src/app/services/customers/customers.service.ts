import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Customer {
    id: string;
    name: string;
    email: string;
    address: string;
    // Agrega otros campos según sea necesario
}

@Injectable({
    providedIn: 'root'
})
export class CustomersService {

    private API_SERVER = 'http://localhost:8080/api/customers';

    constructor(private http: HttpClient) { }

    // Método para obtener todos los clientes
    getCustomers(): Observable<Customer[]> {
        return this.http.get<Customer[]>(this.API_SERVER).pipe(
            catchError(error => {
                console.error('Error al obtener clientes', error);
                return throwError(error);
            })
        );
    }

    // Método para obtener un cliente por ID
    getCustomerById(id: string): Observable<Customer> {
        return this.http.get<Customer>(`${this.API_SERVER}/${id}`).pipe(
            catchError(error => {
                console.error(`Error al obtener el cliente con ID ${id}`, error);
                return throwError(error);
            })
        );
    }

    // Método para crear un nuevo cliente
    createCustomer(customerData: Customer): Observable<Customer> {
        return this.http.post<Customer>(this.API_SERVER, customerData).pipe(
            catchError(error => {
                console.error('Error al crear el cliente:', error);
                return throwError(error);
            })
        );
    }

    // Método para actualizar un cliente por ID
    updateCustomer(id: string, customerData: Customer): Observable<Customer> {
        return this.http.put<Customer>(`${this.API_SERVER}/${id}`, customerData).pipe(
            catchError(error => {
                console.error(`Error al actualizar el cliente con ID ${id}`, error);
                return throwError(error);
            })
        );
    }

    // Método para eliminar un cliente por ID
    deleteCustomer(id: string): Observable<void> {
        return this.http.delete<void>(`${this.API_SERVER}/${id}`).pipe(
            catchError(error => {
                console.error(`Error al eliminar el cliente con ID ${id}`, error);
                return throwError(error);
            })
        );
    }
}
