import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { InventoryService } from '../../../services/inventory.service';
import { ProductsRequest } from '../../../models/products-request';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './form.html',
  styleUrls: ['./form.css']
})
export class FormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private inventoryService = inject(InventoryService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public productForm!: FormGroup;
  public isEditMode: boolean = false;
  private productId: string | null = null;
  public storeId: string = '1'; // ID simulado de la tienda activa del vendedor
  

  // Enumeración de Category de productos
  public categories = ['ELECTRÓNICA', 'HOGAR', 'ALIMENTOS', 'SALUD', 'ROPA', 'OTROS'];

  ngOnInit(): void {
    this.initForm();
    //this.storeId = this.inventoryService.getActualStoreId();
    
    // Evaluamos la URL actual usando la ruta activa
    this.productId = this.route.snapshot.paramMap.get('productId');
    if (this.productId) {
      this.isEditMode = true;
      this.preloadProductData(this.productId);
    }
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(60)]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.maxLength(130)]],
      price: [null, [Validators.required, Validators.min(0.10), Validators.max(200.00)]],
      stock: [null, [Validators.required, Validators.min(0)]]
    });
  }

  private preloadProductData(productId: string): void {
    // Buscamos el producto en el stock de la tienda para rellenar los campos (US-06)
    this.inventoryService.getStockByStore(this.storeId).subscribe({
      next: (products) => {
        const productToEdit = products.find(p => p.id === productId);
        if (productToEdit) {
          this.productForm.patchValue({
            name: productToEdit.name,
            category: productToEdit.category,
            description: productToEdit.description,
            price: productToEdit.price, // Mapeado correctamente desde tu DTO aplanado
            stock: productToEdit.stock
          });
        }
      },
      error: (err) => console.error('Error al precargar los datos del producto:', err)
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const requestData: ProductsRequest = this.productForm.value;

    if (this.isEditMode && this.productId) {
      // Dispara US-06 (PUT /api/inventory/products/{id}?storeId=X)
      this.inventoryService.updateProduct(this.productId, this.storeId, requestData).subscribe({
        next: (res) => {
          alert(res.message); // Muestra el mensaje de éxito enviado por el backend
          this.router.navigate(['/inventory']);
        },
        error: (err) => alert('Error al actualizar el producto: ' + err.message)
      });
    } else {
      // Dispara US-05 (POST /api/inventory/products?storeId=X)
      this.inventoryService.createProduct(this.storeId, requestData).subscribe({
        next: (res) => {
          alert(res.message); // Muestra el mensaje de éxito enviado por el backend
          this.router.navigate(['/inventory']);
        },
        error: (err) => alert('Error al registrar el producto: ' + err.message)
      });
    }
  }
}