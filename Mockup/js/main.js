/**
 * main.js - JavaScript principal para el sitio web de GymTracker
 * Este archivo contiene funcionalidades comunes utilizadas en todas las páginas
 * @version 1.0
 */

'use strict';

/**
 * Inicialización global del sitio
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    
    // Inicialización específica para cada página
    const currentPage = getCurrentPage();
    
    if (currentPage === 'entrenadores') {
        initializeTrainers();
    } else if (currentPage === 'nutricionistas') {
        // Inicialización específica para nutricionistas si existe
    }
});

/**
 * Obtiene el nombre de la página actual basado en la URL
 * @returns {string} Nombre de la página actual
 */
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().split('.')[0];
    return page || 'index';
}

/**
 * Inicializa la navegación responsive
 */
function initializeNavigation() {
    // Toggle para menú móvil
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (navbarToggle && navList) {
        navbarToggle.addEventListener('click', function() {
            navList.classList.toggle('active');
            const isExpanded = navbarToggle.getAttribute('aria-expanded') === 'true';
            navbarToggle.setAttribute('aria-expanded', !isExpanded);
        });
    }
    
    // Manejo de Skip Link
    const skipLink = document.querySelector('.skip-to-content');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = skipLink.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
            }
        });
    }
}

/**
 * Inicializa animaciones generales
 */
function initializeAnimations() {
    // Añadir efecto de rebote a botones con clase .ripple-effect
    const rippleButtons = document.querySelectorAll('.ripple-effect');
    
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            const x = e.clientX - this.getBoundingClientRect().left;
            const y = e.clientY - this.getBoundingClientRect().top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/**
 * Funcionalidades específicas para la página de entrenadores
 */
function initializeTrainers() {
    // Botones de agendamiento
    const agendarButtons = document.querySelectorAll('.trainer-button');
    
    agendarButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const trainerName = this.closest('.trainer-card').querySelector('h2').textContent;
            openScheduleModal(trainerName);
        });
    });
}

/**
 * Abre un modal para agendar una sesión con un entrenador
 * @param {string} trainerName - Nombre del entrenador
 */
function openScheduleModal(trainerName) {
    // En una implementación real, esto abriría un modal con un formulario
    alert(`Próximamente podrás agendar una sesión con ${trainerName}. Esta funcionalidad está en desarrollo.`);
}

/**
 * Resalta el enlace activo en la navegación
 * @returns {void}
 */
function highlightActiveLinks() {
    try {
        const currentPath = window.location.pathname;
        const fileName = currentPath.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('#listAncor');
        
        navLinks.forEach(link => {
            // Obtener el nombre del archivo del href
            const linkPath = link.getAttribute('href');
            const linkFileName = linkPath.split('/').pop();
            
            if (linkFileName === fileName) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    } catch (error) {
        console.error('Error al resaltar enlaces activos:', error);
    }
}

/**
 * Configuración para mejorar la accesibilidad del sitio
 * @returns {void}
 */
function setupAccessibility() {
    // Gestión del foco al usar el enlace para saltar al contenido
    const skipLink = document.querySelector('.skip-to-content');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.tabIndex = -1;
                targetElement.focus();
                
                // Restaurar después para no interferir con el orden de tabulación natural
                setTimeout(() => {
                    targetElement.removeAttribute('tabindex');
                }, 1000);
            }
        });
    }

    // Mejora la navegación por teclado en el menú
    const menuItems = document.querySelectorAll('[role="menuitem"]');
    if (menuItems.length) {
        menuItems.forEach(item => {
            item.addEventListener('keydown', (e) => {
                // Navegación con teclas de flecha
                let targetItem;
                
                switch (e.key) {
                    case 'ArrowRight':
                    case 'ArrowDown':
                        e.preventDefault();
                        targetItem = item.parentElement.nextElementSibling;
                        break;
                    case 'ArrowLeft':
                    case 'ArrowUp':
                        e.preventDefault();
                        targetItem = item.parentElement.previousElementSibling;
                        break;
                    case 'Home':
                        e.preventDefault();
                        targetItem = item.parentElement.parentElement.firstElementChild;
                        break;
                    case 'End':
                        e.preventDefault();
                        targetItem = item.parentElement.parentElement.lastElementChild;
                        break;
                }
                
                if (targetItem) {
                    const targetLink = targetItem.querySelector('[role="menuitem"]');
                    if (targetLink) {
                        targetLink.focus();
                    }
                }
            });
        });
    }
}

/**
 * Desplazamiento suave al hacer clic en enlaces internos
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Omitir el enlace para saltar al contenido
    if (anchor.classList.contains('skip-to-content')) {
        return;
    }
    
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId !== '#') {
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Comprobar la preferencia de reducción de movimiento
                if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                    targetElement.scrollIntoView(); // Desplazamiento instantáneo si se prefiere reducir movimiento
                } else {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                
                // Establecer el foco en el elemento de destino para accesibilidad
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true });
                
                // Eliminar el tabindex después para no afectar la navegación por teclado
                setTimeout(() => {
                    targetElement.removeAttribute('tabindex');
                }, 1000);
            }
        }
    });
});

// Ajustar menú en cambio de tamaño de ventana
window.addEventListener('resize', function() {
    if (window.innerWidth > 980 && navList.classList.contains('active')) {
        navList.classList.remove('active');
    }
}); 