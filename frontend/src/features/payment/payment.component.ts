import { Component, Input, OnInit } from '@angular/core';
import NavbarComponent from '../navbar/navbar.component';
import FooterComponent from '../footer/footer.component';
import { PaymentService } from '../../core/Payment/payment.service';
import { JwtService } from '../../core/jwt/jwt.service';
import { PaymentOrderResponse } from './model/paymentResponse.model';
import { AlertUtil } from '../../shared/alert.util';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
  totalProducts: number | null = null;
  totalServices: number | null = null;
  totalAmount: number | null = null;
  clientId? : number;

  translations: Record<string, string> = {
    'Credit Card': 'Tarjeta de crédito',
    'Debit Card': 'Tarjeta débito',
    'PayPal': 'PayPal',
    'Bank Transfer': 'Transferencia',
  };

  constructor(
    private paymentService: PaymentService,
    private jwtService: JwtService,
    private route : ActivatedRoute
  ) { }

  ngOnInit(): void {

    this.clientId = +this.route.snapshot.paramMap.get('clientId')!;
    if (this.clientId) {
      this.getPaymentsByClientId(this.clientId);
    } else {
      this.profileId = this.jwtService.getProfileIdFromToken();
      if (this.profileId) {
        this.getPaymentsByProfileId(this.profileId);
      }
    }
  }

  getPaymentsByProfileId(profileId: number) {
    this.paymentService.getPaymentsByProfileId(profileId).subscribe({
      next: (response) => {
        this.payments = response.data;
        if(this.payments.length === 0){
          AlertUtil.toast("No hay pagos asignados a este perfíl", "info");
        }
      },
      error: (error) => {
        AlertUtil.toast(`${error.error.message}`, "error");
      }
    })
  }

  getPaymentsByClientId(clientId: number) {
    this.paymentService.getPaymentsByClientId(clientId).subscribe({
      next: (response) => {
        this.payments = response.data;
        if(this.payments.length === 0){
          AlertUtil.toast("No hay pagos asignados a este cliente", "info");
        }
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

  generatePdf(orderDetail: any[], totals: any): string {

    console.log(orderDetail[0].document_number);
    return `
  <!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Comprobante de Orden</title>

  <!-- Tailwind CDN (funciona si usas Puppeteer en backend) -->
  <script src="https://cdn.tailwindcss.com"></script>

  <style>
    body { font-family: Arial, sans-serif; }
  </style>
</head>

<body class="bg-gray-900 min-h-screen flex items-center justify-center p-0 m-0">

  <div class="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-8 border border-gray-200">
  
    <!-- Logo -->
    <div class="flex justify-center mb-6">
      <img src="data:image/png;base64,{{logoBase64}}" class="h-16" alt="Logo">
    </div>

    <!-- Nombre gimnasio -->
    <div class="flex justify-center mb-4">
      <h1 class="text-orange-500 text-2xl font-bold">GymTracker</h1>
    </div>

    <!-- Encabezado -->
    <h1 class="text-2xl font-bold text-center mb-1 text-gray-600">Comprobante de Orden</h1>

    <!-- Número de orden -->
    <div class="text-center mb-6">
      <span class="font-semibold text-lg text-gray-600">Orden #${orderDetail[0].client_order_id}</span>
    </div>

    <!-- Datos del cliente -->
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
    <p class="text-gray-600"><span class="font-semibold text-gray-600">Documento:</span> ${orderDetail[0].document_number}</p>
      <p class="text-gray-600"><span class="font-semibold text-gray-600">Nombres:</span> ${orderDetail[0].first_name} ${orderDetail[0].last_name}</p>
      <p class="text-gray-600"><span class="font-semibold text-gray-600">Correo:</span> ${orderDetail[0].email}</p>
      <p class="text-gray-600"><span class="font-semibold text-gray-600">Fecha:</span> ${orderDetail[0].order_date}</p>
    </div>

    <!-- Tabla de productos -->
    <h2 class="text-lg font-semibold mb-3 text-gray-600">Detalle de la orden</h2>

    <table class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2 text-center text-gray-600">Tipo</th>
          <th class="border p-2 text-center text-gray-600">Nombre</th>
          <th class="border p-2 text-center text-gray-600">Cantidad</th>
          <th class="border p-2 text-center text-gray-600">Precio</th>
        </tr>
      </thead>

      <tbody>
          ${orderDetail.map((order, index) => `
    <tr class="${index % 2 === 0 ? "bg-white" : "bg-gray-100"}">
      <td class="text-gray-600 border text-center">${order.item_type === "PRODUCT" ? "Producto" : "Servicio"}</td>
      <td class="text-gray-600 border text-center">${order.item_type === "SERVICE" ? order.service_name : order.product_name}</td>
      <td class="text-gray-600 border text-center">${order.quantity}</td>
      <td class="text-gray-600 border text-center">${Number(order.unit_price).toLocaleString("es-CO")}</td>
    </tr>
  `).join("")}
      </tbody>
    </table>

    <!-- Totales -->
    <div class="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2 text-gray-600">
      <div class="flex justify-between">
        <span class="font-medium text-gray-600">Subtotal productos:</span>
        <span class="text-gray-600">${Number(totals.products).toLocaleString("es-CO")}</span>
      </div>

      <div class="flex justify-between">
        <span class="font-medium text-gray-600">Subtotal servicios:</span>
        <span class="text-gray-600">${Number(totals.services).toLocaleString("es-CO")}</span>
      </div>

      <div class="flex justify-between text-xl font-bold mt-2 text-gray-600">
        <span>Total:</span>
        <span>${Number(orderDetail[0].total_amount).toLocaleString("es-CO")}</span>
      </div>
    </div>

    <p class="text-center text-orange-500 text-lg my-4">Gracias por tu compra.</p>

    <p class="text-center text-gray-600 text-xs mt-8">
      Este comprobante es generado automáticamente y no requiere firma.
    </p>

  </div>
</body>
</html>
  `;
  }

  downloadPdf() {
    const html = this.generatePdf(this.orderDetail, {
      products: this.totalProducts,
      services: this.totalServices,
      total: this.totalAmount
    });

    return this.paymentService.generatePdf(html).subscribe({
      next: (pdfBlob: Blob) => {

        // Crea una URL temporal
        const blobUrl = window.URL.createObjectURL(pdfBlob);

        // Crea un enlace invisible
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'comprobante.pdf'; // nombre del archivo
        a.click();

        // Limpia URL temporal
        window.URL.revokeObjectURL(blobUrl);
      },
      error: (error) => {
        AlertUtil.toast("Error generando el pdf", "error");
      }
    })
  }



}
