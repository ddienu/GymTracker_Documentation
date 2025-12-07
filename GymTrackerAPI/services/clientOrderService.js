import cartRepository from "../repositories/cartRepository.js";
import clientOrderRepository from "../repositories/clientOrderRepository.js";
import clientRepository from "../repositories/clientRepository.js";
import cartProductRepository from '../repositories/cartProductRepository.js'
import cartServiceRepository from '../repositories/cartServiceRepository.js'
import orderItemRepository from "../repositories/orderItemRepository.js";
import pool from '../config/db.js';
import paymentRepository from "../repositories/paymentRepository.js";

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
      const result = await clientOrderRepository.createClientOrder(clientFounded.client_id, calculateItemsAndAmount.totalAmount, connection);

      //6. Se recorren la totalidad de los productos y servicios para poblar la tabla de orderItem.
      for (let i = 0; i < calculateItemsAndAmount.services.length; i++) {
        await orderItemRepository.createOrderItems(result.orderCreatedId, "SERVICE", calculateItemsAndAmount.services[i].item_id, calculateItemsAndAmount.services[i].quantity, calculateItemsAndAmount.services[i].price, connection);
      }

      for (let i = 0; i < calculateItemsAndAmount.products.length; i++) {
        await orderItemRepository.createOrderItems(result.orderCreatedId, "PRODUCT", calculateItemsAndAmount.products[i].item_id, calculateItemsAndAmount.products[i].quantity, calculateItemsAndAmount.products[i].price, connection);
      }

      //7. Se crea el pago
      const payment = await paymentRepository.create({
        clientOrderId: result.orderCreatedId,
        paymentMethodId: paymentMethodId,
        amount: calculateItemsAndAmount.totalAmount
      }, connection);

      await connection.commit();
      return result;
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

  async getClientOrderById(clientOrderId){
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

  }
}

export default new ClientOrderService(); 