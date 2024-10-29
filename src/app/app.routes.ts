import { Routes } from '@angular/router';
import { OrdersListComponent } from './orders-list/orders-list.component';
import { CustomersListComponent } from './customers-list/customers-list.component';
import { ProductsListComponent } from './products-list/products-list.component';

export const routes: Routes = [
  { path: 'pedidos', component: OrdersListComponent },
  { path: 'clientes', component: CustomersListComponent },
  { path: 'productos', component: ProductsListComponent },
  { path: '', redirectTo: '/pedidos', pathMatch: 'full' },
];
