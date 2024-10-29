import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Product, ProductsService } from '../services/products/products.service';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ProductsListComponent implements OnInit {
  productForm: FormGroup;
  products: Product[] = [];

  constructor(private fb: FormBuilder, private productsService: ProductsService) {
    // Inicializa el formulario
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadProducts(); // Cargar productos al iniciar el componente
  }

  // Método para cargar productos desde la API
  loadProducts(): void {
    this.productsService.getProducts().subscribe(
      (data: Product[]) => this.products = data,
      error => console.error('Error al cargar productos', error)
    );
  }

  // Método para guardar un nuevo producto
  saveProduct(): void {
    if (this.productForm.valid) {
      this.productsService.createProduct(this.productForm.value).subscribe(
        (newProduct: Product) => {
          this.products.push(newProduct); // Agrega el nuevo producto a la lista
          this.productForm.reset(); // Reinicia el formulario
        },
        error => console.error('Error al crear producto', error)
      );
    }
  }
}
