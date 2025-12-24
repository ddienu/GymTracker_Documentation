import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import NavbarComponent from '../../navbar/navbar.component';
import FooterComponent from '../../footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../../core/Products/product.service';
import { AlertUtil } from '../../../shared/alert.util';
import { ProductModel } from '../model/product.model';
import { CommonModule } from '@angular/common';
import { ProductFormStateService } from '../../../core/ProductFormState/product-form-state.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export default class ProductFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  productForm: FormGroup;
  editProductForm: FormGroup;
  isEditting: boolean = false;
  productId: number = 0;
  productFounded!: ProductModel;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private productStateService: ProductFormStateService
  ) {
    (this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      stock: ['', Validators.required],
      // imageUrl: [null, Validators.required],
    })),
      (this.editProductForm = this.fb.group({
        name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        stock: ['', Validators.required],
      }));
  }
  ngOnInit(): void {
    this.productId = +this.route.snapshot.paramMap.get('productId')!;
    if (this.productId != 0) {
      this.loadProductInformation();
    }
    this.productStateService.isEditting$.subscribe( isEdit => {
      this.isEditting = isEdit;
      console.log(this.isEditting);
    })
  }
  loadProductInformation() {
    this.productService.getProductById(this.productId).subscribe({
      next: (response) => {
        this.productFounded = response;
        this.editProductForm.patchValue({
          name: this.productFounded.name,
          description: this.productFounded.description,
          price: this.productFounded.price,
          stock: this.productFounded.stock
        });
      },
      error: (error) => {
        console.error("Error retrieving product by id", error);
      }
    });
  }

  goToProducts() {
    this.productStateService.setEditMode(false);
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

  editProduct(){
    AlertUtil.confirm("¿Desea editar la información del producto?").then(
      (response) => {
        if(response.isConfirmed){
          this.productService.updateProduct(this.productId, this.editProductForm.value).subscribe({
            next: (response) => {
              AlertUtil.toast("El producto ha sido actualizado satisfactoriamente", 'success').then(
                () => {
                  this.productStateService.setEditMode(false);
                  this.router.navigate(['/products']);
                }
              )
            },
            error: (error) => {
              AlertUtil.error("Error actualizando el producto");
              console.error("Error updating product", error);
            }
          })
        }
      }
    )
  }
}
