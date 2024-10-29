import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomersService } from './services/customers/customers.service';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReactiveFormsModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  customerForm!: FormGroup;

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
  }

  guardarCustomers(): void {
    if (this.customerForm.valid) {
        const customerData = this.customerForm.value;
        console.log('Datos del cliente:', customerData); // Agrega este log
        this.customersService.createCustomer(customerData).subscribe(
            response => {
                console.log('Cliente creado exitosamente:', response);
                this.customerForm.reset();
            },
            error => {
                console.error('Error al crear el cliente:', error);
            }
        );
    } else {
        console.log('Formulario no válido');
    }
}

}
