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
  showCustomerForm: boolean = false;
  selectedCustomer: Customer | null = null;
  isEditing: boolean = false; // Nueva propiedad para determinar el estado del formulario

  constructor(private fb: FormBuilder, private customersService: CustomersService) {
    this.customerForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadCustomers();
  }

  private loadCustomers() {
    this.customersService.getCustomers().subscribe({
      next: (customers) => {
        this.customers = customers;
      },
      error: (error) => {
        console.error('Error al cargar clientes', error);
      }
    });
  }

  public guardarCustomers(): void {
    if (this.customerForm.invalid) {
      console.error('Formulario inválido');
      return;
    }

    const customerData: Customer = this.customerForm.value;

    if (this.selectedCustomer && this.selectedCustomer.id) {
      // Actualizar cliente existente
      this.customersService.updateCustomer(this.selectedCustomer.id, customerData).subscribe({
        next: () => {
          console.log('Cliente actualizado', customerData);
          this.loadCustomers();
          this.customerForm.reset();
          this.showCustomerForm = false;
          this.selectedCustomer = null;
          this.isEditing = false; // Resetear el estado de edición
        },
        error: (error) => {
          console.error('Error al actualizar el cliente', error);
        }
      });
    } else {
      // Crear nuevo cliente
      this.customersService.createCustomer(customerData).subscribe({
        next: () => {
          console.log('Cliente creado', customerData);
          this.loadCustomers();
          this.customerForm.reset();
          this.showCustomerForm = false;
        },
        error: (error) => {
          console.error('Error al crear el cliente', error);
        }
      });
    }
  }

  public editar(customer: Customer): void {
    this.customerForm.setValue({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      address: customer.address
    });
    this.showCustomerForm = true;
    this.selectedCustomer = customer;
    this.isEditing = true; // Establecer el estado de edición
  }

  public deleteCustomer(id: string): void {
    this.customersService.deleteCustomer(id).subscribe({
      next: () => {
        console.log('Cliente eliminado', id);
        this.loadCustomers();
      },
      error: (error) => {
        console.error('Error al eliminar el cliente', error);
      }
    });
  }

  toggleCustomerFormVisibility(): void {
    this.showCustomerForm = !this.showCustomerForm;
    this.isEditing = false; // Resetear el estado de edición al crear un nuevo cliente
  }
}