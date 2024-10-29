import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Order, OrdersService } from '../services/orders/orders.service';
import { Customer, CustomersService } from '../services/customers/customers.service';
import { Product, ProductsService } from '../services/products/products.service';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule] // Añadir CommonModule y ReactiveFormsModule a los imports
})
export class OrdersListComponent implements OnInit {
  orderForm: FormGroup;
  orders: Order[] = [];
  customers: Customer[] = [];
  products: Product[] = [];
  
  // Define los estados de la orden
  orderStatuses: string[] = ['NEW', 'PROCESSING', 'COMPLETED'];

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private customersService: CustomersService,
    private productsService: ProductsService
  ) {
    this.orderForm = this.fb.group({
      customerId: ['', Validators.required],
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      status: ['', Validators.required] // Añadido el control para el estado
    });
  }

  ngOnInit() {
    this.loadOrders();
    this.loadCustomers();
    this.loadProducts();
  }

  private loadOrders() {
    this.ordersService.getOrders().subscribe({
  next: (orders) => {
    console.log('Órdenes cargadas:', orders); // Para verificar la estructura de datos
    this.orders = orders;
  },
  error: (error) => {
    console.error('Error al cargar órdenes', error);
  }
});
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

  private loadProducts() {
    this.productsService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        console.error('Error al cargar productos', error);
      }
    });
  }

  saveOrder() {
    if (this.orderForm.invalid) {
      console.error('Formulario inválido');
      return;
    }

    const { customerId, productId, quantity, status } = this.orderForm.value;

    const selectedCustomer = this.customers.find(customer => customer.id === customerId);
    const selectedProduct = this.products.find(product => product.id === productId);

    if (!selectedCustomer || !selectedProduct) {
      console.error('Producto o cliente no encontrado');
      return;
    }

    const newOrder: Order = {
      id: '', // Asume que el backend genera el ID
      customerId: selectedCustomer.id,
      customer: selectedCustomer.name,
      price: selectedProduct.price * quantity,
      quantity: quantity,
      status: status,
      items: [{
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        price: selectedProduct.price,
        quantity: quantity
      }]
    };

    this.ordersService.createOrder(newOrder).subscribe({
      next: (order) => {
        console.log('Orden creada', order);
        this.loadOrders(); // Recargar las órdenes después de crear una nueva
        this.orderForm.reset(); // Limpiar el formulario
      },
      error: (error) => {
        console.error('Error al crear la orden', error);
      }
    });
  }
}
