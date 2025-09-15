# Vista de Plan Alimentario

Esta vista implementa la pantalla "Consultar tu plan alimentario" basada en el diseño proporcionado.

## Características implementadas:

### 🎨 Diseño
- Header con imagen de fondo (actualmente usando gradiente como placeholder)
- Título "Mis planes alimentarios"
- Selector de días de la semana con día activo resaltado
- Lista de comidas con iconos y tipos de comida

### 📱 Funcionalidad
- Navegación desde la homepage mediante la tarjeta "Consulta tu plan alimentario"
- Selector de días interactivo (Aug 09-13)
- Lista de comidas con información de tipo (Desayuno, Almuerzo, Cena)
- Botón de regreso funcional

### 🖼️ Imágenes
Para completar la implementación, necesitas agregar las siguientes imágenes:

1. **assets/meal_background/meal_background.png** - Imagen de fondo del header (como la del bowl de comida saludable)
2. **assets/meals/changua.png** - Imagen de la changua
3. **assets/meals/ramen.png** - Imagen del ramen  
4. **assets/meals/hamburger.png** - Imagen de la hamburguesa

**Nota:** Actualmente usa un gradiente verde como placeholder. Para activar la imagen de fondo, cambia `_hasBackgroundImage()` a `return true` en el código.

### 🎯 Uso
1. Desde la homepage, toca la tarjeta "Consulta tu plan alimentario"
2. Selecciona un día de la semana
3. Ve la lista de comidas programadas para ese día
4. Toca cualquier comida para ver más detalles (funcionalidad pendiente)

### 🔧 Personalización
- Los colores de los iconos de comida se asignan automáticamente por tipo
- El día seleccionado se resalta en naranja (#FF6B35)
- La vista es completamente responsive

### ✅ Nuevas características implementadas
- **Vista de detalle de comida** - Navegación completa al tocar cualquier comida
- **Información nutricional** - Barras de progreso para proteínas, carbohidratos y grasas
- **Lista de ingredientes** - Ingredientes principales, vegetales y toppings organizados
- **Navegación fluida** - Transición suave entre vistas

### 📝 Próximos pasos
- Implementar carga de datos desde API
- Agregar animaciones de transición
- Implementar funcionalidad de favoritos
- Agregar más detalles nutricionales