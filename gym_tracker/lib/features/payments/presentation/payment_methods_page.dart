import 'package:flutter/material.dart';
import 'package:gym_tracker/features/payments/data/models/payment_method_model.dart';
import 'package:gym_tracker/features/payments/data/services/payment_service.dart';

class PaymentMethodsPage extends StatefulWidget {
  final double totalAmount;

  const PaymentMethodsPage({super.key, required this.totalAmount});

  @override
  State<PaymentMethodsPage> createState() => _PaymentMethodsPageState();
}

class _PaymentMethodsPageState extends State<PaymentMethodsPage> {
  final PaymentService _paymentService = PaymentService();
  List<PaymentMethod> _paymentMethods = [];
  int? _selectedPaymentMethodId;
  bool _isLoading = true;
  bool _isProcessing = false;

  @override
  void initState() {
    super.initState();
    _loadPaymentMethods();
  }

  Future<void> _loadPaymentMethods() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final methods = await _paymentService.fetchPaymentMethods();
      setState(() {
        _paymentMethods = methods;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error al cargar métodos de pago: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(200),
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
                    // Botón de retroceso
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
                      'Métodos de pago',
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : SingleChildScrollView(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        // Tarjetas de crédito/débito (decorativas)
                        Row(
                          children: [
                            Expanded(
                              child: _buildCreditCard(
                                color: const Color(0xFFFF5722),
                                bankName: 'Swedbank',
                                cardType: 'debit',
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: _buildCreditCard(
                                color: const Color(0xFFFF6F00),
                                bankName: 'DENISS\nMIHHAILOV',
                                cardType: 'credit',
                                cardNumber: '0812',
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 24),

                        // Métodos de pago dinámicos desde el API
                        ..._paymentMethods.map((method) {
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 16),
                            child: _buildPaymentOption(paymentMethod: method),
                          );
                        }),
                      ],
                    ),
                  ),
          ),

          // Botón Continuar
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.grey.withValues(alpha: 0.2),
                  spreadRadius: 1,
                  blurRadius: 10,
                  offset: const Offset(0, -3),
                ),
              ],
            ),
            child: SafeArea(
              child: SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: _selectedPaymentMethodId == null || _isProcessing
                      ? null
                      : () => _processPayment(),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.black,
                    disabledBackgroundColor: Colors.grey[300],
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: _isProcessing
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2,
                          ),
                        )
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Continuar',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: _selectedPaymentMethodId == null
                                    ? Colors.grey[600]
                                    : Colors.white,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Icon(
                              Icons.arrow_forward,
                              color: _selectedPaymentMethodId == null
                                  ? Colors.grey[600]
                                  : Colors.white,
                            ),
                          ],
                        ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCreditCard({
    required Color color,
    required String bankName,
    required String cardType,
    String? cardNumber,
  }) {
    return Container(
      height: 120,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            spreadRadius: 1,
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            cardType,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 4),
          const Icon(Icons.credit_card, color: Colors.white, size: 24),
          const Spacer(),
          Text(
            bankName,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
            maxLines: 2,
          ),
          if (cardNumber != null) ...[
            const SizedBox(height: 4),
            Text(
              cardNumber,
              style: const TextStyle(color: Colors.white, fontSize: 10),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildPaymentOption({required PaymentMethod paymentMethod}) {
    final isSelected =
        _selectedPaymentMethodId == paymentMethod.paymentMethodId;

    // Asignar ícono y color según el nombre del método
    IconData icon;
    Color iconColor;

    switch (paymentMethod.name.toLowerCase()) {
      case 'efectivo':
        icon = Icons.attach_money;
        iconColor = const Color(0xFF00BCD4);
        break;
      case 'pse':
        icon = Icons.account_balance;
        iconColor = const Color(0xFF1976D2);
        break;
      default:
        icon = Icons.payment;
        iconColor = Colors.grey;
    }

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedPaymentMethodId = paymentMethod.paymentMethodId;
        });
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.black,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? iconColor : Colors.transparent,
            width: 2,
          ),
        ),
        child: Row(
          children: [
            // Ícono
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: iconColor,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: Colors.white, size: 28),
            ),
            const SizedBox(width: 16),
            // Texto
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    paymentMethod.name,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Comisión: ${paymentMethod.transactionFee}',
                    style: TextStyle(color: Colors.grey[400], fontSize: 14),
                  ),
                ],
              ),
            ),
            // Radio button
            Container(
              width: 24,
              height: 24,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: Colors.white, width: 2),
                color: isSelected ? Colors.white : Colors.transparent,
              ),
              child: isSelected
                  ? Center(
                      child: Container(
                        width: 12,
                        height: 12,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: Colors.black,
                        ),
                      ),
                    )
                  : null,
            ),
          ],
        ),
      ),
    );
  }

  void _processPayment() {
    if (_selectedPaymentMethodId == null) return;

    final selectedMethod = _paymentMethods.firstWhere(
      (method) => method.paymentMethodId == _selectedPaymentMethodId,
    );

    // Mostrar confirmación
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirmar pago'),
        content: Text(
          '¿Deseas procesar el pago de \$${widget.totalAmount.toStringAsFixed(0).replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]}.')} con ${selectedMethod.name}?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _createOrder();
            },
            child: const Text('Confirmar'),
          ),
        ],
      ),
    );
  }

  Future<void> _createOrder() async {
    if (_selectedPaymentMethodId == null) return;

    setState(() {
      _isProcessing = true;
    });

    try {
      final orderResponse = await _paymentService.createOrder(
        _selectedPaymentMethodId!,
      );

      if (mounted) {
        setState(() {
          _isProcessing = false;
        });

        // Mostrar éxito
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Orden creada exitosamente: ${orderResponse['message'] ?? 'OK'}',
            ),
            backgroundColor: Colors.green,
          ),
        );

        // Volver al inicio después de un breve delay
        Future.delayed(const Duration(seconds: 2), () {
          if (mounted) {
            Navigator.popUntil(context, (route) => route.isFirst);
          }
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isProcessing = false;
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error al crear la orden: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }
}
