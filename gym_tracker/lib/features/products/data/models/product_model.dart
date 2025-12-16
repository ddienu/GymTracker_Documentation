class ProductModel {
  // API fields
  final int? productId;
  final String name;
  final String? description;
  final double price;
  final int? stock;
  final String? sku;
  final String? imageUrl;
  final bool? isActive;
  
  // Legacy fields for backward compatibility
  final String? legacyId;
  final String? category;
  final bool? legacyIsAvailable;

  ProductModel({
    this.productId,
    required this.name,
    this.description,
    required this.price,
    this.stock,
    this.sku,
    this.imageUrl,
    this.isActive,
    this.legacyId,
    this.category,
    this.legacyIsAvailable,
  });

  // Computed properties for UI compatibility
  String get id => productId?.toString() ?? legacyId ?? '';
  String get categoryName => category ?? 'supplements';
  bool get isAvailable => 
    legacyIsAvailable ?? 
    (isActive == true && (stock == null || stock! > 0));

  // Constructor for API responses with comprehensive validation
  factory ProductModel.fromApi(Map<String, dynamic> json) {
    try {
      // Validate JSON is not null or empty
      if (json.isEmpty) {
        throw FormatException('Empty JSON response received');
      }

      // Validate required fields
      if (json['name'] == null || json['name'].toString().trim().isEmpty) {
        throw FormatException('Product name is required and cannot be empty');
      }
      
      if (json['price'] == null) {
        throw FormatException('Product price is required');
      }

      // Parse and validate price
      double parsedPrice;
      try {
        if (json['price'] is String) {
          final priceStr = json['price'].toString().trim();
          if (priceStr.isEmpty) {
            throw FormatException('Price cannot be empty');
          }
          parsedPrice = double.parse(priceStr);
        } else if (json['price'] is num) {
          parsedPrice = json['price'].toDouble();
        } else {
          throw FormatException('Price must be a number or numeric string');
        }
        
        if (parsedPrice < 0) {
          throw FormatException('Price cannot be negative');
        }
      } catch (e) {
        if (e is FormatException && e.message.startsWith('Price')) {
          rethrow;
        }
        throw FormatException('Invalid price format: ${json['price']}');
      }

      // Parse and validate product_id
      int? parsedProductId;
      if (json['product_id'] != null) {
        try {
          if (json['product_id'] is String) {
            final idStr = json['product_id'].toString().trim();
            if (idStr.isNotEmpty) {
              parsedProductId = int.parse(idStr);
            }
          } else if (json['product_id'] is int) {
            parsedProductId = json['product_id'] as int;
          } else {
            throw FormatException('Product ID must be an integer or numeric string');
          }
          
          if (parsedProductId != null && parsedProductId <= 0) {
            throw FormatException('Product ID must be positive');
          }
        } catch (e) {
          if (e is FormatException && e.message.startsWith('Product ID')) {
            rethrow;
          }
          throw FormatException('Invalid product_id format: ${json['product_id']}');
        }
      }

      // Parse and validate stock
      int? parsedStock;
      if (json['stock'] != null) {
        try {
          if (json['stock'] is String) {
            final stockStr = json['stock'].toString().trim();
            if (stockStr.isNotEmpty) {
              parsedStock = int.parse(stockStr);
            }
          } else if (json['stock'] is int) {
            parsedStock = json['stock'] as int;
          } else {
            throw FormatException('Stock must be an integer or numeric string');
          }
          
          if (parsedStock != null && parsedStock < 0) {
            throw FormatException('Stock cannot be negative');
          }
        } catch (e) {
          if (e is FormatException && (e.message.startsWith('Stock') || e.message.startsWith('Stock'))) {
            rethrow;
          }
          throw FormatException('Invalid stock format: ${json['stock']}');
        }
      }

      // Validate boolean fields (supports boolean, string, and number formats)
      bool? parsedIsActive;
      if (json['is_active'] != null) {
        if (json['is_active'] is bool) {
          parsedIsActive = json['is_active'] as bool;
        } else if (json['is_active'] is String) {
          final activeStr = json['is_active'].toString().toLowerCase().trim();
          if (activeStr == 'true' || activeStr == '1') {
            parsedIsActive = true;
          } else if (activeStr == 'false' || activeStr == '0') {
            parsedIsActive = false;
          } else {
            throw FormatException('Invalid is_active format: ${json['is_active']}');
          }
        } else if (json['is_active'] is int) {
          // Handle integer values (1 = true, 0 = false)
          final activeInt = json['is_active'] as int;
          if (activeInt == 1) {
            parsedIsActive = true;
          } else if (activeInt == 0) {
            parsedIsActive = false;
          } else {
            throw FormatException('Invalid is_active integer value: ${json['is_active']} (must be 0 or 1)');
          }
        } else {
          throw FormatException('is_active must be a boolean, boolean string, or integer (0/1)');
        }
      }

      // Validate URL format if provided
      String? parsedImageUrl;
      if (json['image_url'] != null) {
        parsedImageUrl = json['image_url'].toString().trim();
        if (parsedImageUrl.isNotEmpty) {
          // Basic URL validation
          final uri = Uri.tryParse(parsedImageUrl);
          if (uri == null || (!uri.hasScheme || (uri.scheme != 'http' && uri.scheme != 'https'))) {
            throw FormatException('Invalid image_url format: must be a valid HTTP/HTTPS URL');
          }
        } else {
          parsedImageUrl = null;
        }
      }

      // Validate and clean string fields
      String cleanName = json['name'].toString().trim();
      String? cleanDescription = json['description']?.toString().trim();
      if (cleanDescription?.isEmpty == true) {
        cleanDescription = null;
      }
      
      String? cleanSku = json['sku']?.toString().trim();
      if (cleanSku?.isEmpty == true) {
        cleanSku = null;
      }

      return ProductModel(
        productId: parsedProductId,
        name: cleanName,
        description: cleanDescription,
        price: parsedPrice,
        stock: parsedStock,
        sku: cleanSku,
        imageUrl: parsedImageUrl,
        isActive: parsedIsActive,
      );
    } catch (e) {
      // Re-throw FormatException as is, wrap other exceptions
      if (e is FormatException) {
        rethrow;
      } else {
        throw FormatException('Error parsing API response: ${e.toString()}');
      }
    }
  }

  // Constructor for backward compatibility with existing JSON format
  factory ProductModel.fromJson(Map<String, dynamic> json) {
    return ProductModel(
      legacyId: json['id']?.toString(),
      name: json['name']?.toString() ?? '',
      description: json['description']?.toString(),
      price: (json['price'] ?? 0).toDouble(),
      imageUrl: json['imageUrl']?.toString(),
      category: json['category']?.toString(),
      legacyIsAvailable: json['isAvailable'] as bool?,
    );
  }

  Map<String, dynamic> toJson() {
    if (productId != null) {
      // API format
      return {
        'product_id': productId,
        'name': name,
        'description': description,
        'price': price,
        'stock': stock,
        'sku': sku,
        'image_url': imageUrl,
        'is_active': isActive,
      };
    } else {
      // Legacy format
      return {
        'id': legacyId,
        'name': name,
        'description': description,
        'price': price,
        'imageUrl': imageUrl,
        'category': category,
        'isAvailable': legacyIsAvailable,
      };
    }
  }
}