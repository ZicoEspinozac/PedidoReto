import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OrdersListComponent } from './orders-list.component';

describe('OrderListComponent', () => {
    let component: OrdersListComponent;
    let fixture: ComponentFixture<OrdersListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OrdersListComponent],
            imports: [ReactiveFormsModule],
            schemas: [NO_ERRORS_SCHEMA] // Para evitar errores de componentes hijos
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OrdersListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a form with 4 controls', () => {
        expect(component.orderForm.contains('customer')).toBeTrue();
        expect(component.orderForm.contains('productId')).toBeTrue();
        expect(component.orderForm.contains('quantity')).toBeTrue();
        expect(component.orderForm.contains('status')).toBeTrue();
    });

    it('should not allow quantity less than 1', () => {
        const quantityControl = component.orderForm.get('quantity'); // Accede correctamente al control
        if (quantityControl) {
            quantityControl.setValue(0); // Intenta establecer un valor no permitido
            expect(quantityControl.valid).toBeFalse(); // Verifica que el control sea inválido
            expect(quantityControl.errors?.['min']).toBeTruthy(); // Comprueba que la validación de mínimo esté activa
        } else {
            console.error('quantityControl is null');
        }
    });
});
