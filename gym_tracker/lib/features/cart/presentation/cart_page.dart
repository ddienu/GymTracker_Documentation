import 'dart:math';
import 'package:flutter/material.dart';
import 'package:gym_tracker/features/cart/data/models/cart_item_model.dart';
import 'package:gym_tracker/features/cart/data/services/cart_service.dart';
import 'package:gym_tracker/features/payments/presentation/payment_methods_page.dart';

class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {
  final CartService _cartService = CartService();
  List<CartItem> cartItems = [];
  bool _isLoading = true;
  String? _errorMessage;
  double _totalPrice = 0.0;

  @override
  void initState() {
    super.initState();
    _loadCartItems();
  }

  Future<void> _loadCartItems() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final cartResponse = await _cartService.fetchCart();
      setState(() {
        cartItems = cartResponse.items;
        _totalPrice = cartResponse.total;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
        _errorMessage = e.toString();
        // Si hay error de conexión, mostrar carrito vacío
        cartItems = [];
        _totalPrice = 0.0;
      });
    }
  }

  double get totalPrice {
    return cartItems.fold(0, (sum, item) => sum + item.totalPrice);
  }

  Future<void> _incrementQuantity(int index) async {
    final item = cartItems[index];
    final oldQuantity = item.quantity;
    
    setState(() {
      cartItems[index].quantity++;
      _totalPrice = totalPrice;
    });

    try {
      await _cartService.updateQuantity(item.itemId, item.quantity, itemType: item.type);
    } catch (e) {
      // Revertir si falla
      setState(() {
        cartItems[index].quantity = oldQuantity;
        _totalPrice = totalPrice;
      });
      _showError('Error al actualizar cantidad');
    }
  }

  Future<void> _decrementQuantity(int index) async {
    final item = cartItems[index];
    if (item.quantity <= 1) return;

    final oldQuantity = item.quantity;
    
    setState(() {
      cartItems[index].quantity--;
      _totalPrice = totalPrice;
    });

    try {
      await _cartService.updateQuantity(item.itemId, item.quantity, itemType: item.type);
    } catch (e) {
      // Revertir si falla
      setState(() {
        cartItems[index].quantity = oldQuantity;
        _totalPrice = totalPrice;
      });
      _showError('Error al actualizar cantidad');
    }
  }

  Future<void> _removeItem(int index) async {
    final item = cartItems[index];
    final removedItem = cartItems[index];
    
    setState(() {
      cartItems.removeAt(index);
      _totalPrice = totalPrice;
    });

    try {
      await _cartService.removeItem(item.itemId, itemType: item.type);
    } catch (e) {
      // Revertir si falla
      setState(() {
        cartItems.insert(index, removedItem);
        _totalPrice = totalPrice;
      });
      _showError('Error al eliminar item');
    }
  }

  Future<void> _clearCart() async {
    // Mostrar diálogo de confirmación
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Limpiar carrito'),
        content: const Text('¿Estás seguro de que deseas eliminar todos los productos del carrito?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Eliminar', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    final oldItems = List<CartItem>.from(cartItems);
    final oldTotal = _totalPrice;

    setState(() {
      cartItems.clear();
      _totalPrice = 0.0;
    });

    try {
      await _cartService.clearCart();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Carrito limpiado exitosamente')),
        );
      }
    } catch (e) {
      // Revertir si falla
      setState(() {
        cartItems = oldItems;
        _totalPrice = oldTotal;
      });
      _showError('Error al limpiar el carrito');
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  Widget _buildEmptyCart() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Imagen del plato vacío
          Container(
            width: 280,
            height: 280,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withOpacity(0.2),
                  spreadRadius: 5,
                  blurRadius: 15,
                  offset: const Offset(0, 5),
                ),
              ],
            ),
            child: Stack(
              children: [
                // Patrón de líneas del plato
                ClipOval(
                  child: CustomPaint(
                    size: const Size(280, 280),
                    painter: _PlatePainter(),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 40),
          // Texto
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 40),
            child: Text(
              'No tienes nada en tu carrito de compras.',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: Colors.black87,
                height: 1.3,
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(250),
        child: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          automaticallyImplyLeading: false,
          flexibleSpace: Stack(
            children: [
              // Imagen de fondo con opacidad
              Positioned.fill(
                child: Opacity(
                  opacity: 0.3,
                  child: Image.asset(
                    'assets/gym_background.png',
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              // Contenido del AppBar
              SafeArea(
                child: Column(
                  children: [
                    // Fila con botón de retroceso
                    Padding(
                      padding: const EdgeInsets.only(left: 8, top: 8),
                      child: Align(
                        alignment: Alignment.topLeft,
                        child: IconButton(
                          icon: const Icon(
                            Icons.arrow_back,
                            color: Colors.black,
                            size: 28,
                          ),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ),
                    ),
                    const Spacer(),
                    // Título centrado
                    const Text(
                      'Mi carrito',
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Imagen de cesta de basura centrada
                    GestureDetector(
                      onTap: cartItems.isEmpty ? null : _clearCart,
                      child: Opacity(
                        opacity: cartItems.isEmpty ? 0.5 : 1.0,
                        child: Image.asset(
                          'assets/cart/Wastebasket.png',
                          width: 60,
                          height: 60,
                          errorBuilder: (context, error, stackTrace) {
                            return const Icon(
                              Icons.delete_outline,
                              size: 60,
                              color: Colors.black,
                            );
                          },
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      body: Column(
        children: [
          // Lista de productos
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : cartItems.isEmpty
                    ? _buildEmptyCart()
                    : RefreshIndicator(
                        onRefresh: _loadCartItems,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: cartItems.length,
                          itemBuilder: (context, index) {
                            final item = cartItems[index];
                            return _CartItemCard(
                              item: item,
                              onIncrement: () => _incrementQuantity(index),
                              onDecrement: () => _decrementQuantity(index),
                              onRemove: () => _removeItem(index),
                            );
                          },
                        ),
                      ),
          ),

          // Precio total y botón de pagar
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(24),
                topRight: Radius.circular(24),
              ),
            ),
            child: SafeArea(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Precio total:',
                        style: TextStyle(
                          fontSize: 18,
                          color: Colors.grey[600],
                        ),
                      ),
                      Text(
                        '\$ ${_totalPrice.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}',
                        style: const TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: cartItems.isEmpty
                          ? null
                          : () {
                              Navigator.push(
                                context,
                                MaterialPageRoute(
                                  builder: (context) => PaymentMethodsPage(
                                    totalAmount: _totalPrice,
                                  ),
                                ),
                              );
                            },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.black,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'Pagar',
                            style: TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          SizedBox(width: 8),
                          Icon(Icons.arrow_forward, color: Colors.white),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// Painter para dibujar el plato con líneas
class _PlatePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.grey.shade300
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke;

    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width / 2;

    // Dibujar líneas diagonales
    for (int i = 0; i < 60; i++) {
      final angle = (i * 6) * pi / 180;
      final startX = center.dx + (radius - 20) * cos(angle);
      final startY = center.dy + (radius - 20) * sin(angle);
      final endX = center.dx + radius * cos(angle);
      final endY = center.dy + radius * sin(angle);
      
      canvas.drawLine(
        Offset(startX, startY),
        Offset(endX, endY),
        paint,
      );
    }

    // Círculo interior
    canvas.drawCircle(center, radius - 20, paint..strokeWidth = 1.5);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _CartItemCard extends StatelessWidget {
  final CartItem item;
  final VoidCallback onIncrement;
  final VoidCallback onDecrement;
  final VoidCallback onRemove;

  const _CartItemCard({
    required this.item,
    required this.onIncrement,
    required this.onDecrement,
    required this.onRemove,
  });

  String _getIconForType(String type) {
    switch (type.toLowerCase()) {
      case 'service':
        return '🏋️';
      case 'product':
        return '🛍️';
      case 'training':
        return '💪';
      default:
        return '📦';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFB380),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          // Icono del producto/servicio
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: Text(
                _getIconForType(item.type),
                style: const TextStyle(fontSize: 30),
              ),
            ),
          ),
          const SizedBox(width: 12),

          // Nombre y precio
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.name,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Colors.black87,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 4),
                Text(
                  '\$ ${item.price.toStringAsFixed(2).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')}',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
              ],
            ),
          ),

          // Controles
          Column(
            children: [
              // Botón +
              InkWell(
                onTap: onIncrement,
                child: Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.add, size: 18, color: Colors.black),
                ),
              ),
              const SizedBox(height: 4),

              // Cantidad
              Text(
                '${item.quantity}',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.black,
                ),
              ),
              const SizedBox(height: 4),

              // Botón -
              InkWell(
                onTap: onDecrement,
                child: Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.remove, size: 18, color: Colors.black),
                ),
              ),
              const SizedBox(height: 8),

              // Botón eliminar
              InkWell(
                onTap: onRemove,
                child: Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Icon(Icons.delete_outline,
                      size: 18, color: Colors.red),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
