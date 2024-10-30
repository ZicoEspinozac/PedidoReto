import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms'; // Importar ReactiveFormsModule
import { NO_ERRORS_SCHEMA } from '@angular/core'; // Para evitar errores de componentes hijos
import { ProductsListComponent } from './products-list.component';

describe('ProductsListComponent', () => {
  let component: ProductsListComponent;
  let fixture: ComponentFixture<ProductsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductsListComponent], // Asegúrate de declarar el componente
      imports: [ReactiveFormsModule], // Importar ReactiveFormsModule para formularios reactivos
      schemas: [NO_ERRORS_SCHEMA] // Para evitar errores de componentes hijos
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the product form with default values', () => {
    const nameControl = component.productForm.get('name');
    const priceControl = component.productForm.get('price');
    const stockControl = component.productForm.get('stock');

    expect(nameControl?.value).toBeNull(); // Inicialmente debería ser null
    expect(priceControl?.value).toBeNull(); // Inicialmente debería ser null
    expect(stockControl?.value).toBeNull(); // Inicialmente debería ser null
  });

  it('should add a new product', () => {
    const newProduct = {
      name: 'Nuevo Producto',
      price: 100,
      stock: 50
    };

    // Establecer los valores del formulario
    component.productForm.patchValue(newProduct);
    
    // Llamar a la función de guardar producto
    component.saveProduct();

    // Verificar que el producto ha sido añadido correctamente
    expect(component.products).toContain(jasmine.objectContaining(newProduct));
  });
});
