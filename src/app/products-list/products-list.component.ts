import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products/products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css']
})
export class ProductsListComponent implements OnInit {
  products: any[] = []; // Array para almacenar los productos

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.productsService.getProducts().subscribe(
      (data: any[]) => {
        this.products = data; // Asigna los productos obtenidos
      },
      (error) => {
        console.error('Error al obtener productos:', error);
      }
    );
  }
}
