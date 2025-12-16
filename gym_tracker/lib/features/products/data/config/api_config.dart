/// API configuration constants for the products feature (mobile optimized)
class ApiConfig {
  /// Base URL for the products API - using localhost as default
  /// SafeProductsPage will try multiple endpoints automatically
  static String get baseUrl {
    final envUrl = const String.fromEnvironment('API_BASE_URL');
    if (envUrl.isNotEmpty) return envUrl;
    
    // Default to localhost - SafeProductsPage will try multiple endpoints
    return 'http://localhost:3000/api/products';
  }

  /// Timeout duration for HTTP requests (optimized for mobile)
  static const Duration timeout = Duration(
    seconds: 12,
  ); // Reduced for better mobile UX

  /// Connection timeout for mobile networks
  static const Duration connectionTimeout = Duration(
    seconds: 8,
  ); // Optimized for mobile

  /// Whether to use the API or fallback to mock data
  /// Set to true to use your real API server
  static const bool useApi = bool.fromEnvironment(
    'USE_API',
    defaultValue: true,
  );

  /// Maximum number of retry attempts for failed requests
  static const int maxRetryAttempts = 3;

  /// Delay between retry attempts
  static const Duration retryDelay = Duration(milliseconds: 1000);

  /// Enable detailed logging for debugging (disable in production for performance)
  static const bool enableLogging = bool.fromEnvironment(
    'ENABLE_API_LOGGING',
    defaultValue: true,
  );

  /// Mobile-specific performance settings
  static const int maxConcurrentRequests =
      3; // Limit concurrent requests for mobile
  static const Duration cacheMaxAge = Duration(
    minutes: 5,
  ); // Cache duration for mobile optimization
  static const int maxResponseSizeBytes =
      1024 * 1024; // 1MB limit for mobile responses

  /// Basic HTTP headers for API requests (optimized for mobile)
  static Map<String, String> get basicHeaders => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'User-Agent': 'GymTracker-Mobile/1.0',
    'Accept-Encoding': 'gzip, deflate, br', // Added Brotli compression
    'Connection': 'keep-alive', // Enable persistent connections
    'Cache-Control': 'max-age=300', // 5-minute cache for mobile optimization
  };
}
