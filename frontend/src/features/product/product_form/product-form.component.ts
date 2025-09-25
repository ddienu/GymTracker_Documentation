import { Component, ElementRef, ViewChild } from '@angular/core';
import NavbarComponent from '../../navbar/navbar.component';
import FooterComponent from '../../footer/footer.component';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../../core/Products/product.service';
import { AlertUtil } from '../../../shared/alert.util';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export default class ProductFormComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  productForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      // imageUrl: [null, Validators.required],
    });
  }

  goToProducts() {
    this.router.navigate(['products']);
  }

  openImagePicker() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      this.productForm.patchValue({ imageUrl: file });
      this.productForm.get('imageUrl')?.updateValueAndValidity();
    }
  }

  addProduct() {
    if (this.productForm.valid) {
      const data = this.productForm.value;
      AlertUtil.confirm('¿Desea guardar el nuevo producto?').then(
        (response) => {
          if (response.isConfirmed) {
            this.productService.createProduct(data).subscribe({
              next: (response) => {
                console.log(response);
                AlertUtil.success('Producto creado satisfactoriamente').then(
                  () => {
                    this.router.navigate(['products']);
                  }
                );
              },
              error: (error) => {
                AlertUtil.error(error.error.message);
                console.error('Error adding product', error);
              },
            });
          }
        }
      );
    } else {
      AlertUtil.error('Campos incompletos');
    }
  }
}
