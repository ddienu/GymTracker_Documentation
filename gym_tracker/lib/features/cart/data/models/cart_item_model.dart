// Modelo para el response completo del carrito
class CartResponse {
  final int cartId;
  final List<CartItem> items;
  final double total;

  CartResponse({
    required this.cartId,
    required this.items,
    required this.total,
  });

  factory CartResponse.fromJson(Map<String, dynamic> json) {
    return CartResponse(
      cartId: json['cart_id'] ?? 0,
      items: (json['items'] as List<dynamic>?)
              ?.map((item) => CartItem.fromJson(item))
              .toList() ??
          [],
      total: (json['total'] ?? 0).toDouble(),
    );
  }
}

// Modelo para cada item del carrito
class CartItem {
  final int? cartServiceId;
  final int? cartProductId;
  final int cartId;
  final int? serviceId;
  final int? productId;
  int quantity;
  final double price;
  final String name;
  final String description;
  final String type;

  CartItem({
    this.cartServiceId,
    this.cartProductId,
    required this.cartId,
    this.serviceId,
    this.productId,
    required this.quantity,
    required this.price,
    required this.name,
    required this.description,
    required this.type,
  });

  // Obtener el ID correcto según el tipo
  // Para servicios: usa cart_service_id (identifica el item en el carrito)
  // Para productos: usa product_id (identifica el producto)
  int get itemId {
    final id = type.toLowerCase() == 'service' 
        ? (cartServiceId ?? 0)
        : (productId ?? 0);
    print('itemId getter: type=$type, productId=$productId, serviceId=$serviceId, cartServiceId=$cartServiceId, cartProductId=$cartProductId, returning=$id');
    return id;
  }

  double get totalPrice => price * quantity;

  factory CartItem.fromJson(Map<String, dynamic> json) {
    // Parsear el precio que viene como string
    double parsedPrice = 0.0;
    if (json['price'] != null) {
      if (json['price'] is String) {
        parsedPrice = double.tryParse(json['price']) ?? 0.0;
      } else {
        parsedPrice = (json['price'] as num).toDouble();
      }
    }

    return CartItem(
      cartServiceId: json['cart_service_id'],
      cartProductId: json['cart_product_id'],
      cartId: json['cart_id'] ?? 0,
      serviceId: json['service_id'],
      productId: json['product_id'],
      quantity: json['quantity'] ?? 1,
      price: parsedPrice,
      name: json['name']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      type: json['type']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (cartServiceId != null) 'cart_service_id': cartServiceId,
      if (cartProductId != null) 'cart_product_id': cartProductId,
      'cart_id': cartId,
      if (serviceId != null) 'service_id': serviceId,
      if (productId != null) 'product_id': productId,
      'quantity': quantity,
      'price': price.toString(),
      'name': name,
      'description': description,
      'type': type,
    };
  }

  CartItem copyWith({
    int? cartServiceId,
    int? cartProductId,
    int? cartId,
    int? serviceId,
    int? productId,
    int? quantity,
    double? price,
    String? name,
    String? description,
    String? type,
  }) {
    return CartItem(
      cartServiceId: cartServiceId ?? this.cartServiceId,
      cartProductId: cartProductId ?? this.cartProductId,
      cartId: cartId ?? this.cartId,
      serviceId: serviceId ?? this.serviceId,
      productId: productId ?? this.productId,
      quantity: quantity ?? this.quantity,
      price: price ?? this.price,
      name: name ?? this.name,
      description: description ?? this.description,
      type: type ?? this.type,
    );
  }
}
