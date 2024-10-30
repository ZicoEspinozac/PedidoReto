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

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private customersService: CustomersService,
    private productsService: ProductsService
  ) {
    this.orderForm = this.fb.group({
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
        console.log('Órdenes cargadas:', orders);
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

  editOrderData(orderId: string | undefined) {
    if (!orderId) {
        console.error('ID de orden no proporcionado.');
        return;
    }

    console.log('ID de orden a editar:', orderId); // Línea de log para verificar el ID de orden

    this.ordersService.getOrderById(orderId).subscribe({
        next: (order) => {
            console.log('Datos de la orden a editar:', order); // Línea de log para verificar los datos de la orden

            // Cargar los datos de la orden en el formulario
            this.orderForm.patchValue({
              customer: order.customerId, // Esto sigue siendo el ID
              productId: order.products[0].id,
              quantity: order.quantity,
              status: order.status
          });
            this.selectedOrder = order; // Almacenar la orden seleccionada para futuras referencias
            this.showOrderForm = true; // Mostrar el formulario de edición
        },
        error: (error) => {
            console.error('Error al cargar los datos de la orden', error);
        }
    });
}

public saveOrder() {
  if (this.orderForm.invalid) {
      console.error('Formulario inválido');
      return;
  }

  // Extraer los valores del formulario
  const { customer, productId, quantity, status } = this.orderForm.value;

  // Buscar el cliente y el producto seleccionados en sus respectivas listas
  const selectedCustomer = this.customers.find(c => c.id === customer);
  const selectedProduct = this.products.find(p => p.id === productId);

  if (!selectedCustomer || !selectedProduct) {
      console.error('Producto o cliente no encontrado');
      return;
  }

  // Calcular el precio total
  const totalPrice = selectedProduct.price * quantity;

  // Crear el objeto de nueva orden sin 'id', porque será generado en el backend
  const newOrder: Omit<Order, 'id'> = {
    customerId: selectedCustomer.id,
    customer: selectedCustomer.name,
    price: totalPrice,
    quantity: quantity, // Aquí también se usa quantity
    status: status,
    products: [{
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      stock: quantity // Usa quantity aquí si corresponde
    }]
  };

  console.log('Datos de la orden:', newOrder);

  // Llamada al servicio para crear la orden
  this.ordersService.createOrder(newOrder).subscribe({
      next: (order) => {
          console.log('Orden creada', order);
          this.loadOrders();
          this.orderForm.reset();
          this.showOrderForm = false;
      },
      error: (error) => {
          console.error('Error al crear la orden', error);
      }
  });
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
    this.selectedOrder = order;
  }

  // Método para cerrar los detalles de la orden
  public closeOrderDetails(): void {
    this.selectedOrder = null;
  }
}
