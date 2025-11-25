import { Component, OnInit } from '@angular/core';
import NavbarComponent from '../navbar/navbar.component';
import FooterComponent from '../footer/footer.component';
import { CartService } from '../../core/Cart/cart.service';
import { CommonModule } from '@angular/common';
import { CartItem } from './model/cartItems.model';
import { CopCurrencyPipe } from './pipe/cop_currency.pipe';
import { AlertUtil } from '../../shared/alert.util';
import { RouterLink } from '@angular/router';
import { RemoveItem } from './dto/removeItemRequest.dto';
import { CartResponse } from './model/cartResponse.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule,
    CopCurrencyPipe,
    RouterLink,
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export default class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartResponse : CartResponse | null = null;
  clientId: number = 3;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.getCart(this.clientId);
  }

  getCart(clientId: number) {
    this.cartService.getCart(clientId).subscribe({
      next: (response) => {
        this.cartResponse = response;
        this.cartItems = response.items;
      },
      error: (error) => {
        console.error('Error obteniendo la información del carrito', error);
      },
    });
  }

  clearCart(clientId: number) {
    this.cartService.clearCart(clientId).subscribe({
      next: (response) => {
        AlertUtil.confirm('¿Desea eliminar los elementos de su carrito?').then(
          (response) => {
            if (response.isConfirmed) {
              this.cartService.clearCart(clientId).subscribe({
                next: (response) => {
                  AlertUtil.toast(
                    'Items del carrito eliminados correctamente',
                    'success'
                  ).then(() => {
                    this.getCart(clientId);
                  });
                },
                error: (error) => {
                  console.error(
                    'Error eliminando los items del carrrito',
                    error
                  );
                },
              });
            }
          }
        );
      },
      error: (error) => {
        console.error('Error eliminando los items del carrito', error);
      },
    });
  }

  deleteItem(itemType: string, itemId : number) {
    const itemPayload : RemoveItem = {
      itemType,
      itemId
    };
    AlertUtil.confirm('¿Desea eliminar el item del carrito').then(
      (response) => {
        if (response.isConfirmed) {
          this.cartService.removeItemFromCart(this.clientId, itemPayload).subscribe({
            next: (response) => {
              AlertUtil.toast("Item eliminado correctamente", "success").then(
                () => {
                  this.getCart(this.clientId);
                }
              )
            }, 
            error: (error) => {
              AlertUtil.toast("Error al eliminar el item del carito", "error");
            }
          })
        }
      }
    );
  }
}
