import CustomError from "../utils/CustomError.js";
import cartRepository from "../repositories/cartRepository.js";
import cartProductRepository from "../repositories/cartProductRepository.js";
import clientRepository from "../repositories/clientRepository.js";
import productRepository from "../repositories/productRepository.js";
import db from "../config/db.js";
import serviceRepository from "../repositories/serviceRepository.js";
import cartServiceRepository from "../repositories/cartServiceRepository.js";

const cartService = {
  async _getClientAndCart(userId, connection) {
    const client = await clientRepository.findByUserId(userId, connection);
    if (!client) {
      throw new CustomError("Client profile not found for this user.", 404);
    }
    const cart = await cartRepository.findOrCreateByClientId(
      client.client_id,
      connection
    );
    return { client, cart };
  },
  async _calculateCartTotal(cartId, connection) {
    const conn = connection || (await db.getConnection());
    const shouldRelease = !connection;

    try {
      const cartProducts = await cartProductRepository.findByCartId(
        cartId,
        conn
      );
      const cartServices = await cartServiceRepository.findByCartId(
        cartId,
        conn
      );

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

      return {
        items: [...products, ...services],
        total: totalProducts + totalServices,
      };
    } finally {
      if (shouldRelease) {
        conn.release();
      }
    }
  },

  async getCart(userId) {
    const connection = await db.getConnection();
    try {
      const { cart } = await this._getClientAndCart(userId, connection);

      const { items, total } = await this._calculateCartTotal(
        cart.cart_id,
        connection
      );

      return {
        cart_id: cart.cart_id,
        items,
        total,
      };
    } finally {
      connection.release();
    }
  },

  async addItemToCart(userId, itemData) {
    const { itemType, itemId, quantity } = itemData;

    if (!["product", "service"].includes(itemType)) {
      throw new CustomError("Invalid item type specified.", 400);
    }
    if (!itemId || !quantity || quantity <= 0) {
      throw new CustomError("Item ID and a valid quantity are required.", 400);
    }

    const client = await clientRepository.findByUserId(userId);
    if (!client) throw new CustomError("Client not found", 404);

    const cart = await this._getOrCreateCart(client.client_id);

    if (itemType === "product") {
      const product = await productRepository.findById(itemId);
      if (!product || !product.is_active)
        throw new CustomError("Product not found or not available.", 404);

      const existingItem = await cartProductRepository.findByCartAndProductId(
        cart.cart_id,
        itemId
      );
      const newQuantity = (existingItem ? existingItem.quantity : 0) + quantity;

      if (product.stock < newQuantity)
        throw new CustomError("Not enough stock", 400);

      if (existingItem) {
        await cartProductRepository.updateQuantity(
          existingItem.cart_product_id,
          newQuantity
        );
      } else {
        await cartProductRepository.add(
          cart.cart_id,
          itemId,
          quantity,
          product.price
        );
      }
    } else {
      // itemType === 'service'
      const service = await serviceRepository.findById(itemId);
      if (!service)
        throw new CustomError("Service not found or not available.", 404);

      const existingItem = await cartServiceRepository.findByCartAndService(
        cart.cart_id,
        itemId
      );
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        await cartServiceRepository.updateQuantity(
          existingItem.cart_service_id,
          newQuantity
        );
      } else {
        const result = await cartServiceRepository.add(
          cart.cart_id,
          itemId,
          quantity,
          service.price
        );
        console.log(result);
      }
    }

    return this.getCart(userId);
  },

  async updateProductQuantityInCart(userId, productId, quantity) {
    const client = await clientRepository.findByUserId(userId);
    if (!client) throw new CustomError("Client not found", 404);

    const cart = await cartRepository.findByClientId(client.client_id);
    if (!cart) throw new CustomError("Cart not found", 404);

    const product = await productRepository.findById(productId);
    if (!product) throw new CustomError("Product not found", 404);
    if (product.stock < quantity)
      throw new CustomError("Not enough stock", 400);

    const existingProduct = await cartProductRepository.findByCartAndProductId(
      cart.cart_id,
      productId
    );
    if (!existingProduct) throw new CustomError("Product not in cart", 404);

    await cartProductRepository.updateQuantity(
      existingProduct.cart_product_id,
      quantity
    );
    return this.getCart(userId);
  },

  async removeProductFromCart(clientId, productId) {
    const client = await clientRepository.findByUserId(clientId);
    if (!client) throw new CustomError("Client not found", 404);

    const cart = await cartRepository.findCartByProfileId(clientId);
    if (!cart) throw new CustomError("Cart not found", 404);

    const existingProduct = await cartProductRepository.findByCartAndProductId(
      cart.cart_id,
      productId
    );
    if (!existingProduct) throw new CustomError("Product not in cart", 404);

    await cartProductRepository.remove(existingProduct.cart_product_id);
    return this.getCart(clientId);
  },

  async clearCart(userId) {
    const client = await clientRepository.findByUserId(userId);
    if (!client) throw new CustomError("Client not found", 404);

    const cart = await cartRepository.findByClientId(client.client_id);
    if (cart) {
      await cartProductRepository.clearByCartId(cart.cart_id);
      await cartServiceRepository.clearByCartId(cart.cart_id);
    }
    return { message: "Cart cleared successfully." };
  },

  async _getOrCreateCart(clientId) {
    let cart = await cartRepository.findByClientId(clientId);
    if (!cart) {
      const result = await cartRepository.create(clientId);
      console.log("Este es el result de createCart", result);
      cart = await cartRepository.findById(result.insertId);
    }
    return cart;
  },

  async updateServiceQuantityInCart(userId, serviceId, quantity) {
    const client = await clientRepository.findByUserId(userId);
    if (!client) throw new CustomError("Client not found", 404);

    const cart = await cartRepository.findByClientId(client.client_id);
    if (!cart) throw new CustomError("Cart not found", 404);

    const service = await serviceRepository.findById(serviceId);
    if (!service) throw new CustomError("Service not found", 404);

    const existingService = await cartServiceRepository.findByCartAndService(
      cart.cart_id,
      serviceId
    );

    if (!existingService) throw new CustomError("Service not in cart", 404);

    await cartServiceRepository.updateQuantity(
      existingService.cart_service_id,
      quantity
    );
    return this.getCart(userId);
  },

  async removeServiceFromCart(clientId, serviceId) {
    const client = await clientRepository.findByUserId(clientId);
    if (!client) throw new CustomError("Client not found", 404);

    const cart = await cartRepository.findCartByProfileId(clientId);
    if (!cart) throw new CustomError("Cart not found", 404);

    const existingService = await cartServiceRepository.findByCartAndService(
      cart.cart_id,
      serviceId
    );

    console.log(existingService);

    if (!existingService) throw new CustomError("Service not in card", 404);

    await cartServiceRepository.remove(existingService.cart_service_id);

    return this.getCart(clientId);
  },
};

export default cartService;
