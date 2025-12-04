import { Component, OnInit } from '@angular/core';
import NavbarComponent from '../navbar/navbar.component';
import FooterComponent from '../footer/footer.component';
import { PaymentService } from '../../core/Payment/payment.service';
import { JwtService } from '../../core/jwt/jwt.service';
import { PaymentOrderResponse } from './model/paymentResponse.model';
import { AlertUtil } from '../../shared/alert.util';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  isModalOpen : boolean = false;

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
  
  changeModalState(){
    this.isModalOpen = !this.isModalOpen;
    console.log(this.isModalOpen);
  }


}
