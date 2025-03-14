# Guía de Estándares W3C para el Proyecto GymTracker

Este documento proporciona directrices para asegurar que todo el proyecto GymTracker cumpla con los estándares web del W3C (World Wide Web Consortium) para HTML5, CSS3, accesibilidad web (WCAG 2.1) y JavaScript.

## Índice

1. [Introducción](#introducción)
2. [Estándares HTML5](#estándares-html5)
3. [Estándares CSS3](#estándares-css3)
4. [Accesibilidad Web (WCAG 2.1)](#accesibilidad-web-wcag-21)
5. [JavaScript y DOM](#javascript-y-dom)
6. [Rendimiento Web](#rendimiento-web)
7. [Diseño Responsivo](#diseño-responsivo)
8. [Semántica y Metadatos](#semántica-y-metadatos)
9. [Herramientas de Validación](#herramientas-de-validación)
10. [Lista de Verificación](#lista-de-verificación)
11. [Recursos Adicionales](#recursos-adicionales)
12. [Panel de Administración y Accesibilidad](#panel-de-administración-y-accesibilidad)

## Introducción

Esta guía es una referencia para asegurar que todo el código del proyecto GymTracker cumpla con los estándares web establecidos por el W3C. Seguir estos estándares garantiza:

- **Compatibilidad entre navegadores**
- **Accesibilidad** para usuarios con discapacidades
- **Mantenibilidad** del código a largo plazo
- Mejor **posicionamiento SEO**
- **Rendimiento** optimizado
- **Escalabilidad** para futuras ampliaciones

## Estándares HTML5

### Estructura del Documento

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Descripción concisa de la página">
    <title>Título descriptivo - GymTracker</title>
    <link rel="stylesheet" href="ruta/al/archivo.css">
</head>
<body>
    <header role="banner">
        <!-- Contenido del encabezado -->
    </header>
    <main id="main-content" role="main">
        <!-- Contenido principal -->
    </main>
    <footer role="contentinfo">
        <!-- Contenido del pie de página -->
    </footer>
    <script src="ruta/al/archivo.js" defer></script>
</body>
</html>
```

### Buenas Prácticas HTML

1. **Utilizar elementos semánticos**: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
2. **Atributos obligatorios**:
   - `alt` en imágenes (excepto decorativas)
   - `lang` en elemento HTML
   - `title` en el elemento `<head>`
3. **Anidado correcto**: No anides elementos de bloque dentro de elementos en línea
4. **Atributos de accesibilidad**:
   - Roles ARIA: `role="banner"`, `role="main"`, etc.
   - Estados ARIA: `aria-expanded`, `aria-hidden`, etc.
5. **Enlaces de salto** para navegación por teclado
6. **Estructura jerárquica** de encabezados (h1-h6)

## Estándares CSS3

### Organización del Código

```css
/* Estructura recomendada para todos los archivos CSS */
/*--------------------------------------------------------------------------*
* Tabla de contenidos:
* 1. Variables y reset
* 2. Tipografía 
* 3. Layout y estructura
* 4. Componentes
* 5. Utilidades y accesibilidad
* 6. Media queries
*--------------------------------------------------------------------------*/

:root {
    /* Variables CSS */
    --primary-color: #E6ED07;
    /* Otras variables */
}

/* Reset y estilos base */

/* Tipografía */

/* Layout */

/* Componentes */

/* Utilidades */

/* Media queries */
```

### Buenas Prácticas CSS

1. **Usar variables CSS** para colores, espaciados, etc.
2. **Nomenclatura coherente** (preferiblemente BEM: Block, Element, Modifier)
3. **Evitar !important** (excepto utilidades específicas)
4. **Minimizar especificidad** para facilitar sobrescrituras
5. **Comentar secciones** principales
6. **Media queries** para diferentes dispositivos
7. **Prefijos de proveedores** solo cuando sea necesario
8. **Evitar unidades absolutas** (px) para texto; usar unidades relativas (rem, em)

### Accesibilidad en CSS

1. **Contraste de colores** adecuado (ratio mínimo 4.5:1)
2. **Estados de foco visibles** para todos los elementos interactivos
3. **Soporte para preferencias de usuario**:
   ```css
   @media (prefers-reduced-motion: reduce) {
       * {
           animation-duration: 0.01ms !important;
           transition-duration: 0.01ms !important;
       }
   }
   
   @media (prefers-contrast: more) {
       /* Estilos para alto contraste */
   }
   ```

## Accesibilidad Web (WCAG 2.1)

### Principios POUR

1. **Perceptible**: La información debe ser presentable para los usuarios de manera que puedan percibirla
2. **Operable**: Los componentes de la interfaz deben ser operables
3. **Comprensible**: La información y el manejo de la interfaz deben ser comprensibles
4. **Robusto**: El contenido debe ser lo suficientemente robusto para ser interpretado por una variedad de agentes de usuario

### Requisitos de Nivel AA (mínimo recomendado)

1. **Alternativas textuales** para contenido no textual
2. **Subtítulos** para contenido multimedia
3. **Estructura semántica** clara
4. **Contraste de color** mínimo 4.5:1
5. **Redimensionamiento** del texto sin pérdida de funcionalidad
6. **Navegación por teclado** completa
7. **Etiquetas e instrucciones** claras para formularios
8. **Gestión del foco** en elementos interactivos
9. **Prevención de errores** en formularios

### Implementación Práctica

1. **Saltar al contenido principal**:
   ```html
   <a class="skip-to-content" href="#main-content">Saltar al contenido principal</a>
   ```

2. **Atributos ARIA para estados dinámicos**:
   ```html
   <button aria-expanded="false" aria-controls="dropdown">Menú</button>
   <div id="dropdown" aria-hidden="true">...</div>
   ```

3. **Textos alternativos descriptivos**:
   ```html
   <img src="logo.png" alt="Logo de GymTracker">
   <!-- Para imágenes decorativas -->
   <img src="decorativa.png" alt="" role="presentation">
   ```

4. **Formularios accesibles**:
   ```html
   <label for="nombre">Nombre:</label>
   <input id="nombre" type="text" aria-required="true">
   <p id="error-nombre" class="error" aria-live="polite"></p>
   ```

## JavaScript y DOM

### Buenas Prácticas JS

1. **Uso de 'use strict'** al inicio de cada archivo
2. **Manejo de errores** con try/catch
3. **Comprobaciones de existencia** antes de manipular elementos
4. **Separación de preocupaciones** (datos vs. presentación)
5. **Delegación de eventos** para mejorar rendimiento
6. **Comentarios JSDoc** para funciones
7. **Evitar variables globales**
8. **Usar promesas o async/await** para operaciones asíncronas

### Accesibilidad en JS

1. **Mantener el foco** al mostrar/ocultar elementos
2. **Actualizar atributos ARIA** al cambiar estados
3. **Usar `aria-live`** para alertas y notificaciones
4. **Comprobar preferencias de usuario** como `prefers-reduced-motion`
5. **Permitir navegación por teclado** en componentes personalizados

```javascript
// Ejemplo de toggle accesible
function toggleMenu() {
    const menu = document.getElementById('menu');
    const menuButton = document.getElementById('menu-button');
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    
    menuButton.setAttribute('aria-expanded', !isExpanded);
    menu.setAttribute('aria-hidden', isExpanded);
    
    if (!isExpanded) {
        // Abrir menú
        menu.classList.add('active');
        // Establecer el foco en el primer elemento
        const firstItem = menu.querySelector('a');
        if (firstItem) firstItem.focus();
    } else {
        // Cerrar menú
        menu.classList.remove('active');
        // Devolver el foco al botón
        menuButton.focus();
    }
}
```

## Rendimiento Web

### Optimización de Recursos

1. **Carga diferida** (lazy loading) para imágenes fuera de la vista
   ```html
   <img src="imagen.jpg" loading="lazy" alt="Descripción" width="800" height="600">
   ```

2. **Atributos `width` y `height`** para evitar cambios de layout

3. **Cargar JS al final** del documento o con `defer`/`async`
   ```html
   <script src="script.js" defer></script>
   ```

4. **Minimizar CSS y JS** en producción

5. **Optimizar imágenes** (WebP, AVIF, SVG cuando sea posible)

6. **Fuentes web optimizadas** con `font-display: swap`

## Diseño Responsivo

### Buenas Prácticas

1. **Mobile-first**: Diseñar primero para móviles, luego expandir para dispositivos más grandes
2. **Viewport meta tag**:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```
3. **Media queries** para adaptar el diseño
4. **Imágenes fluidas**:
   ```css
   img {
       max-width: 100%;
       height: auto;
   }
   ```
5. **Unidades relativas** (%, rem, em, vh, vw) para dimensionamiento
6. **Flexbox y Grid** para layouts adaptativos

## Semántica y Metadatos

### HTML Semántico

1. **Estructura jerárquica de encabezados** (h1-h6)
2. **Uso adecuado de elementos**:
   - `<article>` para contenido independiente
   - `<section>` para agrupar contenido relacionado
   - `<aside>` para contenido tangencial
   - `<time>` para fechas y horas
   - `<address>` para información de contacto
   - `<figure>` y `<figcaption>` para ilustraciones

### Metadatos

1. **Básicos**:
   ```html
   <meta name="description" content="Descripción concisa de la página">
   <meta name="author" content="GymTracker">
   ```

2. **Avanzados (Open Graph)**:
   ```html
   <meta property="og:title" content="Título para compartir">
   <meta property="og:description" content="Descripción para compartir">
   <meta property="og:image" content="URL de la imagen a compartir">
   <meta property="og:url" content="URL canónica">
   ```

3. **URL canónica**:
   ```html
   <link rel="canonical" href="https://www.gymtracker.com/pagina/">
   ```

## Herramientas de Validación

### Validadores W3C

- [Validador HTML](https://validator.w3.org/)
- [Validador CSS](https://jigsaw.w3.org/css-validator/)

### Accesibilidad

- [WAVE](https://wave.webaim.org/)
- [axe DevTools](https://www.deque.com/axe/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) (Google)

### Rendimiento

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)

## Lista de Verificación

### HTML
- [ ] DOCTYPE HTML5 correcto
- [ ] Atributo `lang` en elemento HTML
- [ ] Meta viewport presente
- [ ] Meta charset "utf-8"
- [ ] Título descriptivo
- [ ] Estructura semántica (header, main, footer)
- [ ] Imágenes con atributo `alt`
- [ ] Enlaces con texto significativo
- [ ] Formularios con etiquetas (`label`)
- [ ] Atributos ARIA cuando sean necesarios
- [ ] Estructura de encabezados (h1-h6) lógica

### CSS
- [ ] Variables CSS para colores y valores reutilizables
- [ ] Media queries para dispositivos móviles
- [ ] Estados de foco visibles
- [ ] Contrastes de color suficientes
- [ ] Soporte para preferencias del usuario
- [ ] Unidades relativas para tamaños de texto

### Accesibilidad
- [ ] Enlace para saltar al contenido principal
- [ ] Navegación completa por teclado
- [ ] Roles ARIA apropiados
- [ ] Textos alternativos descriptivos
- [ ] Estados interactivos accesibles (ARIA)
- [ ] Formularios accesibles con validación
- [ ] Contraste de color suficiente (ratio mínimo 4.5:1)

### JavaScript
- [ ] Mejora progresiva (funcional sin JS)
- [ ] Manejo de errores con try/catch
- [ ] Actualización apropiada de atributos ARIA
- [ ] Comprobación de preferencias del usuario
- [ ] Compatibilidad con navegación por teclado
- [ ] Comentarios JSDoc

### Rendimiento
- [ ] Imágenes optimizadas
- [ ] CSS y JS minimizados
- [ ] Carga diferida para recursos no críticos
- [ ] Precarga de recursos críticos
- [ ] Fuentes web optimizadas

## Recursos Adicionales

### Documentación Oficial
- [Estándares W3C](https://www.w3.org/standards/)
- [WAI-ARIA](https://www.w3.org/WAI/standards-guidelines/aria/)
- [WCAG 2.1](https://www.w3.org/TR/WCAG21/)

### Guías y Tutoriales
- [MDN Web Docs](https://developer.mozilla.org/)
- [web.dev](https://web.dev/)
- [A11Y Project](https://www.a11yproject.com/)

### Herramientas y Plugins
- [ESLint](https://eslint.org/) con configuración para accesibilidad
- [Stylelint](https://stylelint.io/) para CSS

## Panel de Administración y Accesibilidad

El panel de administración de GymTracker ha sido implementado siguiendo los estándares de accesibilidad WCAG 2.1 nivel AA. A continuación se detallan las consideraciones especiales para esta sección:

### Navegación y Estructura

1. **Enlace para saltar el contenido**:
   ```html
   <a class="skip-to-admin" href="#admin-content">Saltar al contenido principal</a>
   ```

2. **Roles ARIA específicos para paneles de administración**:
   - `role="navigation"` para el menú lateral
   - `role="menubar"` y `role="menuitem"` para los elementos de menú
   - `role="grid"` y `role="gridcell"` para el calendario
   - `role="alert"` para mensajes de error o notificaciones

3. **Estados de expansión**:
   ```html
   <button aria-expanded="false" aria-controls="admin-sidebar">...</button>
   ```

### Tablas de Datos Administrativos

Las tablas son elementos críticos en paneles administrativos y deben cumplir con:

1. **Cabeceras correctamente identificadas**:
   ```html
   <th scope="col">Nombre de Usuario</th>
   ```

2. **Descripciones útiles mediante caption**:
   ```html
   <table aria-label="Tabla de usuarios recientes">
     <caption class="sr-only">Lista de usuarios registrados recientemente en el sistema</caption>
     ...
   </table>
   ```

3. **Relaciones entre celdas y cabeceras**:
   ```html
   <td headers="column-header-id">Contenido</td>
   ```

### Gráficos y Visualizaciones

1. **Alternativas para gráficos**:
   ```html
   <canvas id="planChart" aria-label="Gráfico de distribución de planes" role="img"></canvas>
   <div id="planChartNoData" class="no-data" hidden>No hay datos disponibles</div>
   ```

2. **Datos en formato accesible**:
   - Proporcionar tablas alternativas con los mismos datos
   - Asegurar que la información crítica no dependa solo del color

3. **Manejo de errores en carga de datos**:
   ```javascript
   function showChartError(chartId, noDataId) {
       const chartElement = document.getElementById(chartId);
       const noDataElement = document.getElementById(noDataId);
       
       if (chartElement) {
           chartElement.style.display = 'none';
       }
       
       if (noDataElement) {
           noDataElement.hidden = false;
           noDataElement.textContent = 'Error al cargar datos. Intente nuevamente más tarde.';
       }
   }
   ```

### Formularios Administrativos

Los formularios en un panel de administración deben tener:

1. **Etiquetas claras y explícitas**:
   ```html
   <label for="username">Nombre de usuario <span class="required">*</span></label>
   <input id="username" name="username" type="text" aria-required="true">
   ```

2. **Validación accesible**:
   ```html
   <p id="username-error" class="error-message" aria-live="polite" hidden>
     El nombre de usuario es obligatorio
   </p>
   ```

3. **Agrupación lógica de campos**:
   ```html
   <fieldset>
     <legend>Información de contacto</legend>
     <!-- Campos relacionados -->
   </fieldset>
   ```

### Feedback y Notificaciones

1. **Mensajes de error**:
   ```html
   <div class="admin-error-message" role="alert" aria-live="assertive">
     Mensaje de error
   </div>
   ```

2. **Confirmaciones de acciones**:
   ```html
   <div class="admin-success-message" role="status" aria-live="polite">
     Acción completada con éxito
   </div>
   ```

3. **Indicadores de progreso**:
   ```html
   <div class="loading-indicator" role="progressbar" aria-valuetext="Cargando datos...">
     Cargando...
   </div>
   ```

### Interacciones con JavaScript

1. **Manejo de foco**:
   ```javascript
   function toggleMenu() {
       // Al abrir el menú, enfocar el primer elemento
       if (!isExpanded) {
           const firstItem = menu.querySelector('a');
           if (firstItem) firstItem.focus();
       } else {
           // Al cerrar, devolver el foco al botón
           menuButton.focus();
       }
   }
   ```

2. **Navegación por teclado**:
   ```javascript
   item.addEventListener('keydown', (event) => {
       if (event.key === 'ArrowDown') {
           event.preventDefault();
           // Mover al siguiente elemento
       }
   });
   ```

3. **Preferencias de usuario**:
   ```javascript
   if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
       // Desactivar animaciones
   }
   ```

### Lista de Verificación para Panel de Administración

- [ ] Todas las funciones son accesibles mediante teclado
- [ ] Cada sección tiene un encabezado apropiado (h1-h6)
- [ ] Los gráficos tienen alternativas textuales
- [ ] Las acciones críticas tienen confirmación
- [ ] Los mensajes de error son claros y accesibles
- [ ] El foco se gestiona correctamente en modales y menús desplegables
- [ ] Se respetan las preferencias de usuario (contraste, movimiento)
- [ ] Los elementos interactivos tienen estados visibles (hover, focus, active)
- [ ] Las tablas de datos complejos tienen relaciones claras entre celdas

---

Esta guía fue desarrollada para el proyecto GymTracker con el objetivo de asegurar que todo el código cumpla con los estándares web actuales. Revise periódicamente esta documentación ya que los estándares evolucionan con el tiempo.

**Versión**: 1.0  
**Última actualización**: Marzo 2024 