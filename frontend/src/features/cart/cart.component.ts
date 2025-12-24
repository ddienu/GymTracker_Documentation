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
import { JwtService } from '../../core/jwt/jwt.service';
import { RequestCartItem } from './dto/requestCartItem.dto';
import { OrderService } from '../../core/Order/order.service';
import { PaymentMethodService } from '../../core/PaymentMethod/payment-method.service';
import { PaymentMethodResponse } from '../payment-method/model/paymentMethodResponse.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    CommonModule,
    CopCurrencyPipe,
    RouterLink,
    FormsModule
  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export default class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartResponse: CartResponse | null = null;
  clientId: number | null = null;
  paymentMethods: PaymentMethodResponse[] = [];
  selectedPaymentMethodId: number | null = null;

  translations: Record<string, string> = {
    'Credit Card': 'Tarjeta de crédito',
    'Debit Card': 'Tarjeta débito',
    'PayPal': 'PayPal',
    'Bank Transfer': 'Transferencia bancaria',
  };

  constructor(
    private cartService: CartService,
    private jwtService: JwtService,
    private orderService: OrderService,
    private paymentMethodsService: PaymentMethodService
  ) { }

  ngOnInit() {
    this.clientId = this.jwtService.getProfileIdFromToken();
    this.getCart(this.clientId!);
    this.getPaymentMethods();
  }

  getCart(clientId: number) {
    this.cartService.getCart(clientId).subscribe({
      next: (response) => {
        this.cartResponse = response;
        this.cartItems = response.items;
        console.log(this.cartItems);
      },
      error: (error) => {
        console.error('Error obteniendo la información del carrito', error);
      },
    });
  }

  updateQuantityInCart(itemType: string, itemId: number, quantity: number) {
    const itemPayload: RequestCartItem = {
      itemId: itemId,
      itemType: itemType,
      quantity: quantity,
    };

    this.cartService
      .updateQuantityInCart(this.clientId!, itemPayload)
      .subscribe({
        next: (response) => {
          this.getCart(this.clientId!);
        },
        error: (error) => {
          AlertUtil.toast('Error al actualizar la cantidad', 'error');
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

  deleteItem(itemType: string, itemId: number) {
    const itemPayload: RemoveItem = {
      itemType,
      itemId,
    };
    AlertUtil.confirm('¿Desea eliminar el item del carrito').then(
      (response) => {
        if (response.isConfirmed) {
          this.cartService
            .removeItemFromCart(this.clientId!, itemPayload)
            .subscribe({
              next: (response) => {
                AlertUtil.toast('Item eliminado correctamente', 'success').then(
                  () => {
                    this.getCart(this.clientId!);
                  }
                );
              },
              error: (error) => {
                AlertUtil.toast(
                  'Error al eliminar el item del carito',
                  'error'
                );
              },
            });
        }
      }
    );
  }

  generateOrderProcess() {
    if(this.selectedPaymentMethodId !== null){
    AlertUtil.confirm("¿Deseas proceder al pago?").then(
      (response) => {
        if (response.isConfirmed) {
          this.orderService.generateOrder(this.clientId!, this.selectedPaymentMethodId!).subscribe({
            next: (response) => {
              console.log(response);
              AlertUtil.toast("Order generada satisfactoriamente", "success").then(
                () => {
                  AlertUtil.success("Serás redirigido para completar tu pago...").then(
                    () => {
                      this.cartService.clearCart(this.clientId!).subscribe({
                        next: (response) => {
                          AlertUtil.success("Tu compra se está procesando, podrás ingresar a tus ordenes para obtener más información").then(
                            () => {
                              this.getCart(this.clientId!);
                            }
                          )
                        },
                        error: (error) => {
                          console.error(
                            'Error eliminando los items del carrito',
                            error
                          );
                        },
                      });
                    }
                  )
                }
              )
            },
            error: (error) => {
              console.error(error);
              AlertUtil.toast("Error generando la orden", "error");
            }
          })
        }
      }
    )
    }else{
      AlertUtil.toast("Favor seleccione un método de pago", "info");
    }
  }

  getPaymentMethods() {
    this.paymentMethodsService.getPaymentMethods().subscribe({
      next: (response) => {
        console.log(response);
        this.paymentMethods = response;
      },
      error: (error) => {
        AlertUtil.toast("Error obteniendo los métodos de pago", "error");
      }
    })
  }
}
