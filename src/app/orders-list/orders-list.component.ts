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
  imports: [CommonModule, ReactiveFormsModule]
})
export class OrdersListComponent implements OnInit {

  orderForm: FormGroup;
  orders: Order[] = [];
  customers: Customer[] = [];
  products: Product[] = [];
  showOrderForm: boolean = false;
  selectedOrder: Order | null = null; // Para mostrar detalles de la orden seleccionada
  orderStatuses: string[] = ['NEW', 'PROCESSING', 'COMPLETED'];
  searchQuery: string = ''; // Variable para búsqueda
  isEditing: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private customersService: CustomersService,
    private productsService: ProductsService
  ) {
    this.orderForm = this.fb.group({
      id: [''],
      customer: ['', Validators.required],
      productId: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]], // Mínimo 1
      status: ['', Validators.required]
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
        this.orders = orders.map(order => ({
          ...order,
          totalPrice: order.products.reduce((total, product) => total + (product.price * product.stock), 0)
        }));
      },
      error: (error) => {
        console.error('Error al cargar las órdenes', error);
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


  public saveOrder(): void {
    if (this.orderForm.invalid) {
      console.error('Formulario inválido');
      return;
    }
  
    // Extraer los valores del formulario
    const { id, customer, productId, quantity, status } = this.orderForm.value;
  
    // Buscar el cliente y el producto seleccionados en sus respectivas listas
    const selectedCustomer = this.customers.find(c => c.id === customer);
    const selectedProduct = this.products.find(p => p.id === productId);
  
    if (!selectedCustomer || !selectedProduct) {
      console.error('Producto o cliente no encontrado');
      return;
    }
  
    // Calcular el precio total
    const totalPrice = selectedProduct.price * quantity;
  
    // Crear el objeto de orden
    const orderData: Omit<Order, 'id'> = {
      customerId: selectedCustomer.id,
      customer: selectedCustomer.name,
      price: totalPrice,
      quantity: quantity,
      status: status,
      products: [{
        id: selectedProduct.id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        stock: quantity
      }],
      totalPrice: totalPrice
    };
  
    if (this.selectedOrder && this.selectedOrder.id) {
      // Actualizar orden existente
      this.ordersService.updateOrder(this.selectedOrder.id, { ...orderData, id: this.selectedOrder.id }).subscribe({
        next: () => {
          console.log('Orden actualizada', orderData);
          this.loadOrders(); // Recargar las órdenes después de actualizar
          this.orderForm.reset();
          this.showOrderForm = false;
          this.selectedOrder = null;
          this.isEditing = false;
        },
        error: (error) => {
          console.error('Error al actualizar la orden', error);
        }
      });
    } else {
      // Crear nueva orden
      this.ordersService.createOrder(orderData).subscribe({
        next: (order) => {
          console.log('Orden creada', order);
          this.loadOrders(); // Recargar las órdenes después de crear
          this.orderForm.reset();
          this.showOrderForm = false;
        },
        error: (error) => {
          console.error('Error al crear la orden', error);
        }
      });
    }
  }

  public editar(order: Order): void {
    if (order && order.id) {
      this.orderForm.setValue({
        id: order.id,
        customer: order.customer,
        productId: order.products[0].id,
        quantity: order.quantity,
        status: order.status
      });
      this.showOrderForm = true;
      this.selectedOrder = order;
      this.isEditing = true;
    } else {
      console.error('Orden no válida o ID de la orden es undefined');
    }
  }

  public deleteOrder(id?: string) {
    if (id) {
      this.ordersService.deleteOrder(id).subscribe({
        next: () => {
          console.log('Orden eliminada', id);
          this.loadOrders(); // Recargar las órdenes después de eliminar
        },
        error: (error) => {
          console.error('Error al eliminar la orden', error);
        }
      });
    } else {
      console.error('ID de la orden es undefined');
    }
  }

  toggleOrderFormVisibility() {
    this.showOrderForm = !this.showOrderForm;
  }

  // Método para filtrar las órdenes
  get filteredOrders() {
    console.log("imprimiendo orders", this.orders);
    return this.orders.filter(order => 
      order.customer.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  // Método para abrir los detalles de la orden
  public openOrderDetails(order: Order): void {
    const totalPrice = order.products.reduce((total, product) => total + (product.price * product.stock), 0);
    this.selectedOrder = { ...order, totalPrice };
  }

  // Método para cerrar los detalles de la orden
  public closeOrderDetails(): void {
    this.selectedOrder = null;
  }
}
