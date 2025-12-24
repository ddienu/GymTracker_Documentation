import cartRepository from "../repositories/cartRepository.js";
import clientOrderRepository from "../repositories/clientOrderRepository.js";
import clientRepository from "../repositories/clientRepository.js";
import cartProductRepository from '../repositories/cartProductRepository.js'
import cartServiceRepository from '../repositories/cartServiceRepository.js'
import orderItemRepository from "../repositories/orderItemRepository.js";
import pool from '../config/db.js';
import paymentRepository from "../repositories/paymentRepository.js";
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
import appointmentCreditsRepository from "../repositories/appointmentCreditsRepository.js";
import CustomError from "../utils/CustomError.js";

class ClientOrderService {
  //   /**
  //    * Obtiene los detalles de un cliente por el ID de su usuario.
  //    * @param {number} userId - El ID del usuario.
  //    * @returns {Promise<object>} Los detalles del cliente.
  //    */
  async createClientOrder(profileId, paymentMethodId) {

    const connection = await pool.getConnection();

    try {

      await connection.beginTransaction();

      //1. Se busca el cliente por profileId
      const clientFounded = await clientRepository.findByProfileId(profileId);

      if (!clientFounded) {
        throw new CustomError('El cliente no existe', 400);
      };

      //2. Se busca si el cliente tiene algún carrito creado.
      const clientCartFounded = await cartRepository.findByClientId(clientFounded.client_id);

      if (!clientCartFounded) {
        throw new CustomError('El cliente no tiene carrito asociado', 404);
      }

      //3. Con base al carrito creado, se buscan los productos y servicios que están dentro del carrito.
      const clientCartProducts = await cartProductRepository.findByCartId(clientCartFounded.cart_id);

      const clientCartServices = await cartServiceRepository.findByCartId(clientCartFounded.cart_id);

      //4. Se llama al método para calcular el valor total de los items y se retorna un objeto con los productos y servicios con el itemType incluído
      const calculateItemsAndAmount = this._calculateTotalAmount(clientCartProducts, clientCartServices);

      //5. Se crea la orden del cliente
      const clientOrderCreated = await clientOrderRepository.createClientOrder(clientFounded.client_id, calculateItemsAndAmount.totalAmount, connection);

      //6. Se recorren la totalidad de los productos y servicios para poblar la tabla de orderItem.
      for (let i = 0; i < calculateItemsAndAmount.services.length; i++) {
        const orderItemCreated = await orderItemRepository.createOrderItems(clientOrderCreated.orderCreatedId, "SERVICE", calculateItemsAndAmount.services[i].item_id, calculateItemsAndAmount.services[i].quantity, calculateItemsAndAmount.services[i].price, connection);
        if (calculateItemsAndAmount.services[i].requires_appointment === 1) {
          for (let j = 0; j < calculateItemsAndAmount.services[i].quantity; j++) {
            const createAppointmentCredit = await appointmentCreditsRepository.createAppointmentCredit(clientFounded.client_id, calculateItemsAndAmount.services[i].item_id, clientOrderCreated.orderCreatedId, orderItemCreated.insertId, connection);
          }
        };
      }

      for (let i = 0; i < calculateItemsAndAmount.products.length; i++) {
        await orderItemRepository.createOrderItems(clientOrderCreated.orderCreatedId, "PRODUCT", calculateItemsAndAmount.products[i].item_id, calculateItemsAndAmount.products[i].quantity, calculateItemsAndAmount.products[i].price, connection);
      }

      //7. Se crea el pago
      const payment = await paymentRepository.create({
        clientOrderId: clientOrderCreated.orderCreatedId,
        paymentMethodId: paymentMethodId,
        amount: calculateItemsAndAmount.totalAmount
      }, connection);

      await connection.commit();
      return clientOrderCreated;
    } catch (error) {
      await connection.rollback();
    } finally {
      connection.release();
    }
  };

  _calculateTotalAmount(cartProducts, cartServices) {


    const products = cartProducts.map((p) => ({
      ...p,
      type: "product",
    }));

    const services = cartServices.map((s) => ({
      ...s,
      type: "service",
    }));

    const totalProducts = products.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const totalServices = services.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const totalAmount = totalProducts + totalServices;

    return { products, services, totalAmount };
  };

  async getClientOrderById(clientOrderId) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      //1. Se realiza la consulta para traer los datos de la orden del cliente
      const clientOrder = await clientOrderRepository.getClientOrderById(clientOrderId);
      return clientOrder;

    } catch (error) {
      await connection.rollback();
    } finally {
      connection.release();
    }
  };

  async generatePdf(html) {
    try {

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);


      const logoPath = path.join(__dirname, "../uploads/GymTrackerLogo.png");
      const logoBase64 = fs.readFileSync(logoPath, "base64");

      const htmlWithLogo = html.replace("{{logoBase64}}", logoBase64);

      const browser = await puppeteer.launch({
        headless: "new"
      });

      const page = await browser.newPage();

      await page.setContent(`
        <html>
          <head>
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@3.4.1/dist/tailwind.min.css" rel="stylesheet">
          </head>
          <body class="bg-gray-900 text-white p-6">
            ${htmlWithLogo}
          </body>
        </html>
      `, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "0px",
          bottom: "0px",
          left: "0px",
          right: "0px",
        }
      });

      await browser.close();
      return pdf;

    } catch (error) {
      throw new CustomError("Error generando el pdf", 500);
    }
  }
}

export default new ClientOrderService(); 