class PaymentMethod {
  final int paymentMethodId;
  final String name;
  final String transactionFee;
  final int isActive;

  PaymentMethod({
    required this.paymentMethodId,
    required this.name,
    required this.transactionFee,
    required this.isActive,
  });

  factory PaymentMethod.fromJson(Map<String, dynamic> json) {
    return PaymentMethod(
      paymentMethodId: json['payment_method_id'] as int,
      name: json['name'] as String,
      transactionFee: json['transaction_fee'] as String,
      isActive: json['is_active'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'payment_method_id': paymentMethodId,
      'name': name,
      'transaction_fee': transactionFee,
      'is_active': isActive,
    };
  }
}
