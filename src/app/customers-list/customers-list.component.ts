import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { CustomersService, Customer } from '../services/customers/customers.service';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent]
})
export class CustomersListComponent implements OnInit {
  customerForm: FormGroup;
  customers: Customer[] = [];

  // Inyectar el servicio de clientes
  constructor(private fb: FormBuilder, private customersService: CustomersService) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCustomers(); // Cargar los clientes al inicializar
  }

  loadCustomers() {
    this.customersService.getCustomers().subscribe(
      (data: Customer[]) => this.customers = data,
      error => console.error('Error al cargar clientes', error)
    );
  }

  guardarCustomers() {
    if (this.customerForm.valid) {
      this.customersService.createCustomer(this.customerForm.value).subscribe(
        (newCustomer: Customer) => {
          this.customers.push(newCustomer);
          this.customerForm.reset(); // Reiniciar el formulario después de agregar
        },
        error => console.error('Error al crear cliente', error)
      );
    }
  }
}
