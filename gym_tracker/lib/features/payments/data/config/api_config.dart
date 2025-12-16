/// API configuration for payments feature
class PaymentsApiConfig {
  /// Base URL for the payments API
  static String get baseUrl {
    return 'http://localhost:3000/api/orders';
  }

  /// Timeout duration for HTTP requests
  static const Duration timeout = Duration(seconds: 10);

  /// Basic HTTP headers
  static Map<String, String> get headers => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
}
