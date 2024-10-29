import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService, Customer } from './services/customers/customers.service'; // Importa Customer
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  customerForm!: FormGroup;
  customers: Customer[] = [];

  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService
  ) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });

    this.loadCustomers();
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
          this.customerForm.reset();
        },
        error => console.error('Error al crear cliente', error)
      );
    }
  }
}