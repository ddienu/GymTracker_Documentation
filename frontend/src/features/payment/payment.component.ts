import { Component, OnInit } from '@angular/core';
import NavbarComponent from '../navbar/navbar.component';
import FooterComponent from '../footer/footer.component';
import { PaymentService } from '../../core/Payment/payment.service';
import { JwtService } from '../../core/jwt/jwt.service';
import { PaymentOrderResponse } from './model/paymentResponse.model';
import { AlertUtil } from '../../shared/alert.util';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderItemDetail } from './model/orderItemDetail.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export default class PaymentComponent implements OnInit {

  payments: PaymentOrderResponse[] = [];
  profileId: number | null = null;
  isModalOpen: boolean = false;
  orderDetail: OrderItemDetail[] = [];
  totalProducts : number | null = null;
  totalServices : number | null = null;
  totalAmount : number | null = null;

  translations: Record<string, string> = {
    'Credit Card': 'Tarjeta de crédito',
    'Debit Card': 'Tarjeta débito',
    'PayPal': 'PayPal',
    'Bank Transfer': 'Transferencia',
  };

  constructor(
    private paymentService: PaymentService,
    private jwtService: JwtService
  ) { }

  ngOnInit(): void {
    this.profileId = this.jwtService.getProfileIdFromToken();
    if (this.profileId) {
      this.getPaymentsByProfileId(this.profileId);
    }
  }

  getPaymentsByProfileId(profileId: number) {
    this.paymentService.getPaymentsByProfileId(profileId!).subscribe({
      next: (response) => {
        this.payments = response.data;
        console.log(this.payments);
      },
      error: (error) => {
        AlertUtil.toast(`${error.error.message}`, "error");
      }
    })
  }

  changeModalState() {
    this.isModalOpen = !this.isModalOpen;
    console.log(this.isModalOpen);
  }

  getProductsTotalPrice() {
    return this.orderDetail
      .filter(i => i.item_type === 'PRODUCT')
      .reduce((acc, item) => acc + (item.quantity * Number(item.unit_price)), 0);
  }

  getServicesTotalPrice() {
    return this.orderDetail
      .filter(i => i.item_type === 'SERVICE')
      .reduce((acc, item) => acc + (item.quantity * Number(item.unit_price)), 0);
  }

  getOrderDetailsByOrderId(orderId: number) {
    this.paymentService.getOrderDetailById(orderId).subscribe({
      next: (response) => {
        this.orderDetail = response.data;
        this.totalProducts = this.getProductsTotalPrice();
        this.totalServices = this.getServicesTotalPrice();
        this.totalAmount = this.totalProducts + this.totalServices;
        console.log(this.orderDetail);
      },
      error: (error) => {
        AlertUtil.toast("Error obteniendo el detalle de la orden", "error");
      }
    })
  }


}
