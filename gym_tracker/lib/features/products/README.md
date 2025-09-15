# Módulo de Productos

Este módulo maneja la funcionalidad de productos y servicios del gimnasio.

## Estructura

```
lib/features/products/
├── data/
│   ├── models/
│   │   └── product_model.dart          # Modelo de datos del producto
│   └── repositories/
│       └── products_repository.dart    # Repositorio para manejo de datos
├── presentation/
│   ├── widgets/
│   │   └── product_card.dart          # Widget de tarjeta de producto
│   ├── products_page.dart             # Página principal de productos
│   └── product_detail_page.dart       # Página de detalle del producto
└── README.md
```

## Funcionalidades

### ✅ Implementadas
- Visualización de lista de productos en grid
- Navegación entre "Productos" y "Servicios"
- Detalle de producto individual con scroll avanzado
- Modelo de datos con serialización JSON
- Repositorio con datos mock y descripción detallada
- Formateo de precios en pesos colombianos
- Navegación desde la página principal
- Fondo de gimnasio (gym_background.png) solo en la sección superior
- Header con imagen de fondo con opacidad 0.7 para mejor legibilidad
- Título "Productos" en negro con fuente Work Sans, posicionado más abajo
- Botón de retroceso en negro, posicionado más abajo para mejor UX
- Botones de categoría integrados en el header
- Zona de productos con fondo limpio y claro
- Tipografía Work Sans en toda la interfaz
- Sombras mejoradas en las tarjetas de productos
- Página de detalle con SliverAppBar y scroll personalizado
- Descripción rica con emojis y formato mejorado
- Layout responsivo con tarjetas separadas para producto y descripción

### 🚧 Por implementar
- Carrito de compras funcional
- Integración con API real
- Filtros y búsqueda de productos
- Categorías de productos
- Gestión de inventario
- Sistema de favoritos
- Reseñas y calificaciones

## Uso

### Navegación a productos
```dart
Navigator.pushNamed(context, 'products');
```

### Modelo de producto
```dart
final product = ProductModel(
  id: '1',
  name: 'Pre-Workout',
  description: 'Suplemento pre-entreno',
  price: 225000,
  imageUrl: 'assets/productos/pre_workout.png',
  category: 'supplements',
);
```

### Obtener productos
```dart
final repository = ProductsRepository();
final products = await repository.getProducts();
```

## Assets

Los assets de productos deben ubicarse en:
- `assets/productos/` - Imágenes de productos
- `assets/servicios/` - Imágenes de servicios

Actualmente se incluyen placeholders para:
- pre_workout.png
- whey_protein.png
- amino_energy.png
- creatine.png

## Configuración

Asegúrate de que el `pubspec.yaml` incluya:

```yaml
flutter:
  assets:
    - assets/productos/
```

## Testing

Ejecutar tests del módulo:
```bash
flutter test test/features/products/
```

## Próximos pasos

1. Reemplazar imágenes placeholder con imágenes reales
2. Implementar carrito de compras
3. Conectar con API backend
4. Agregar más productos y categorías
5. Implementar sistema de pagos