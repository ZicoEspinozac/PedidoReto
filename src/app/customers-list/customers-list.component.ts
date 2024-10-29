import { Component, OnInit } from '@angular/core';
import { CustomersService } from '../services/customers/customers.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css']
})
export class CustomersListComponent implements OnInit {
  customers: any[] = []; // Array para almacenar los clientes

  constructor(private customersService: CustomersService) {}

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes(): void {
    this.customersService.getCustomers().subscribe(
      (data: any[]) => {
        this.customers = data; // Asigna los clientes obtenidos
      },
      (error) => {
        console.error('Error al obtener clientes:', error);
      }
    );
  }
}
