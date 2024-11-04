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
  products: any[] = [];
  showProductForm: boolean = false;
  selectedProduct: any | null = null;
  isEditing: boolean = false; // Nueva propiedad para determinar el estado del formulario

  constructor(private fb: FormBuilder, private productsService: ProductsService) {
    this.productForm = this.fb.group({
      id: [''],
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
      (data: any[]) => this.products = data,
      error => console.error('Error al cargar productos', error)
    );
  }

  // Método para guardar un nuevo producto o actualizar uno existente
  saveProduct(): void {
    if (this.productForm.invalid) {
      console.error('Formulario inválido');
      return;
    }

    const productData: any = this.productForm.value;

    if (this.selectedProduct && this.selectedProduct.id) {
      // Actualizar producto existente
      this.productsService.updateProduct(this.selectedProduct.id, productData).subscribe(
        (updatedProduct: any) => {
          const index = this.products.findIndex(p => p.id === updatedProduct.id);
          if (index !== -1) {
            this.products[index] = updatedProduct; // Actualiza el producto en la lista
          }
          this.productForm.reset();
          this.showProductForm = false;
          this.selectedProduct = null;
          this.isEditing = false; // Resetear el estado de edición
        },
        error => console.error('Error al actualizar producto', error)
      );
    } else {
      // Crear nuevo producto
      this.productsService.createProduct(productData).subscribe(
        (newProduct: any) => {
          this.products.push(newProduct); // Agrega el nuevo producto a la lista
          this.productForm.reset();
          this.showProductForm = false;
        },
        error => console.error('Error al crear producto', error)
      );
    }
  }

  // Método para editar un producto
  editar(product: any): void {
    this.productForm.setValue({
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock
    });
    this.showProductForm = true;
    this.selectedProduct = product;
    this.isEditing = true; // Establecer el estado de edición
  }

  // Método para eliminar un producto
  deleteProduct(id: string): void {
    this.productsService.deleteProduct(id).subscribe(
      () => {
        this.products = this.products.filter(p => p.id !== id); // Elimina el producto de la lista
      },
      error => console.error('Error al eliminar producto', error)
    );
  }

  // Método para mostrar/ocultar el formulario de producto
  toggleProductFormVisibility(): void {
    this.showProductForm = !this.showProductForm;
    this.isEditing = false; // Resetear el estado de edición al crear un nuevo producto
  }
}