import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/Products/product.service';
import { ProductModel } from './model/product.model';
import NavbarComponent from '../navbar/navbar.component';
import FooterComponent from '../footer/footer.component';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JwtService } from '../../core/jwt/jwt.service';
import { AlertUtil } from '../../shared/alert.util';
import { AuthService } from '../../core/Auth/auth.service';
import { ProductFormStateService } from '../../core/ProductFormState/product-form-state.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export default class ProductComponent implements OnInit {
  products: ProductModel[] = [];
  role: String = '';
  isAuthenticated : boolean = false;
  isEditing: boolean = false;

  constructor(
    private productService: ProductService,
    private jwtService: JwtService,
    private authService: AuthService,
    private router: Router,
    private productStateService : ProductFormStateService
  ) {}

  ngOnInit(): void {
    this.getProducts();
    this.getRoleFromToken();
    this.userIsAuthenticated();
  }

  getProducts() {
    return this.productService.getProducts().subscribe({
      next: (response) => {
        this.products = response;
        console.log(this.products);
      },
      error: (error) => {
        console.error('Error in getProducts product component', error);
      },
    });
  }

  getRoleFromToken() {
    this.role = this.jwtService.extractRoleFromToken();
    console.log(this.role);
  }

  goToEdit(productId: number) {
    this.productStateService.setEditMode(true);
    // this.formStateService.setServiceIdToEdit(serviceId);
    this.router.navigate([`/products/edit/${productId}`]);
  }

  removeProduct(productId: number) {
    AlertUtil.confirm('¿Deseas eliminar el producto?').then((response) => {
      if (response.isConfirmed) {
        this.productService.deleteProduct(productId).subscribe({
          next: (response) => {
            console.log(response);
            AlertUtil.toast("Producto eliminado correctamente", "success").then(
              () => this.getProducts()
            )
          },
          error: (error) => {
            console.error('Error erasing product', error);
            AlertUtil.toast("Error al eliminar el producto", "error")
          },
        });
      }
    });
  }

  userIsAuthenticated(){
    this.isAuthenticated = this.authService.isAuthenticated();
  }

  goToAdd(){
    this.router.navigate(['/products/add']);
  }
}
