class OrderModels {
  final int? orderId;
  final int? clientId;
  final String? orderDate;
  final String? orderStatus;
  final String? totalAmount;

  OrderModels({
    this.orderId,
    this.clientId,
    this.orderDate,
    this.orderStatus,
    this.totalAmount,
  });

  factory OrderModels.fromJson(Map<String, dynamic> json) {
    return OrderModels(
      orderId: json['order_id'],
      clientId: json['client_id'],
      orderDate: json['order_date'],
      orderStatus: json['order_status'],
      totalAmount: json['total_amount'],
    );
  }
}