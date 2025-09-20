class Product{
  final int productId;
  final String name;
  final String description;
  final double price;
  final int stock;
  final String sku;
  final String imageUrl;
  final bool isActive;

  Product({
    required this.productId,
    required this.name, 
    required this.description, 
    required this.price, 
    required this.stock, 
    required this.sku, 
    required this.imageUrl, 
    required this.isActive,
  });

  factory Product.fromJson(Map<String, dynamic> json){
    return Product(
      productId: json['product_id'] as int,
      name: json['name'] as String,
      description: json['description'] as String,
      price: double.parse(json['price']),
      stock: json['stock'] as int,
      sku: json['sku'] as String,
      imageUrl: json['image_url'] as String,
      isActive: json['is_active'] == 1
    );
  }
}