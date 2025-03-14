/**
 * admin.js - Funcionalidades JavaScript para el panel de administración de GymTracker
 * @version 1.0
 * Este archivo contiene todas las funciones relacionadas con la interactividad del
 * panel de administración, incluyendo gráficos, navegación y gestión de datos.
 */

'use strict';

// Esperar a que el DOM esté completamente cargado antes de ejecutar código
document.addEventListener('DOMContentLoaded', () => {
    try {
        initializeAdminNavigation();
        initializeAdminCharts();
        initializeCalendarSystem();
        setupAdminAccessibility();
        initializeDataActions();
    } catch (error) {
        console.error('Error al inicializar funciones del panel de administración:', error);
        displayErrorMessage('Ha ocurrido un error al cargar el panel de administración');
    }
});

/**
 * Inicializa la navegación del panel de administración, incluyendo el menú lateral y la navegación por teclado
 * @returns {void}
 */
function initializeAdminNavigation() {
    // Menú lateral para dispositivos móviles
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (!menuToggle || !sidebar) {
        console.warn('Elementos de navegación de administración no encontrados');
        return;
    }
    
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        sidebar.classList.toggle('active');
        
        // Gestión del foco para accesibilidad
        if (!isExpanded) {
            // Al abrir el menú, enfocar el primer elemento del menú
            const firstMenuItem = sidebar.querySelector('a');
            if (firstMenuItem) {
                setTimeout(() => firstMenuItem.focus(), 50);
            }
        }
    });
    
    // Cierre del menú con Escape
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && sidebar.classList.contains('active')) {
            menuToggle.setAttribute('aria-expanded', 'false');
            sidebar.classList.remove('active');
            menuToggle.focus();
        }
    });
    
    // Navegación por teclado en el menú lateral
    const menuItems = document.querySelectorAll('.admin-nav-link');
    menuItems.forEach((item, index) => {
        item.addEventListener('keydown', (event) => {
            let targetItem;
            
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    targetItem = menuItems[index + 1] || menuItems[0]; // Ir al siguiente o volver al primero
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    targetItem = menuItems[index - 1] || menuItems[menuItems.length - 1]; // Ir al anterior o al último
                    break;
                case 'Home':
                    event.preventDefault();
                    targetItem = menuItems[0]; // Ir al primer elemento
                    break;
                case 'End':
                    event.preventDefault();
                    targetItem = menuItems[menuItems.length - 1]; // Ir al último elemento
                    break;
            }
            
            if (targetItem) {
                targetItem.focus();
            }
        });
    });
}

/**
 * Inicializa los gráficos utilizados en el panel de administración
 * @returns {void}
 */
function initializeAdminCharts() {
    try {
        initializePlanDistributionChart();
        initializeAttendanceChart();
    } catch (error) {
        console.error('Error al inicializar gráficos:', error);
        showChartError('planChart', 'planChartNoData');
        showChartError('attendanceChart', 'attendanceChartNoData');
    }
}

/**
 * Inicializa el gráfico de distribución de planes
 * @returns {void}
 */
function initializePlanDistributionChart() {
    const planChartElement = document.getElementById('planChart');
    const noDataElement = document.getElementById('planChartNoData');
    
    if (!planChartElement) {
        console.warn('Elemento para el gráfico de planes no encontrado');
        return;
    }
    
    try {
        // Simulación de datos (en producción se obtendrían de una API o base de datos)
        const plansData = {
            labels: ['Básico', 'Premium', 'Elite'],
            datasets: [{
                data: [45, 35, 20],
                backgroundColor: ['#2196F3', '#FF9800', '#37474F'],
                borderWidth: 0
            }]
        };

        const ctx = planChartElement.getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: plansData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            boxWidth: 12,
                            font: {
                                family: "'Roboto', sans-serif",
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        },
                        bodyFont: {
                            family: "'Roboto', sans-serif",
                            size: 14
                        },
                        titleFont: {
                            family: "'Roboto', sans-serif",
                            size: 16
                        }
                    }
                },
                animation: {
                    duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1000
                }
            }
        });
        
        // Ocultar el mensaje de no hay datos
        if (noDataElement) {
            noDataElement.hidden = true;
        }
    } catch (error) {
        console.error('Error al crear gráfico de planes:', error);
        showChartError('planChart', 'planChartNoData');
    }
}

/**
 * Inicializa el gráfico de asistencia mensual
 * @returns {void}
 */
function initializeAttendanceChart() {
    const attendanceChartElement = document.getElementById('attendanceChart');
    const noDataElement = document.getElementById('attendanceChartNoData');
    
    if (!attendanceChartElement) {
        console.warn('Elemento para el gráfico de asistencia no encontrado');
        return;
    }
    
    try {
        // Simulación de datos (en producción se obtendrían de una API o base de datos)
        const attendanceData = {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct'],
            datasets: [{
                label: 'Asistencia 2023',
                data: [65, 72, 78, 74, 80, 85, 90, 86, 92, 88],
                borderColor: '#E6ED07',
                backgroundColor: 'rgba(230, 237, 7, 0.1)',
                tension: 0.3,
                fill: true
            }]
        };

        const ctx = attendanceChartElement.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: attendanceData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                family: "'Roboto', sans-serif"
                            }
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                family: "'Roboto', sans-serif"
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                family: "'Roboto', sans-serif",
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        bodyFont: {
                            family: "'Roboto', sans-serif",
                            size: 14
                        },
                        titleFont: {
                            family: "'Roboto', sans-serif",
                            size: 16
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                },
                animation: {
                    duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1000
                }
            }
        });
        
        // Ocultar el mensaje de no hay datos
        if (noDataElement) {
            noDataElement.hidden = true;
        }
    } catch (error) {
        console.error('Error al crear gráfico de asistencia:', error);
        showChartError('attendanceChart', 'attendanceChartNoData');
    }
}

/**
 * Muestra un mensaje de error en un gráfico
 * @param {string} chartId - ID del elemento canvas del gráfico
 * @param {string} noDataId - ID del elemento para mostrar el mensaje de error
 * @returns {void}
 */
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

/**
 * Inicializa el sistema de calendario para la administración de clases
 * @returns {void}
 */
function initializeCalendarSystem() {
    const prevButton = document.querySelector('.calendar-navigation button:first-child');
    const nextButton = document.querySelector('.calendar-navigation button:last-child');
    const calendarTitle = document.querySelector('.calendar-title');
    
    if (!prevButton || !nextButton || !calendarTitle) {
        console.warn('Elementos de calendario no encontrados');
        return;
    }
    
    // Fecha actual para el calendario
    let currentDate = new Date();
    
    // Actualiza el título del calendario
    function updateCalendarTitle() {
        const months = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];
        
        calendarTitle.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        // Anunciar cambio para lectores de pantalla
        calendarTitle.setAttribute('aria-live', 'polite');
    }
    
    // Evento para el botón anterior
    prevButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendarTitle();
        // En una implementación real, aquí se cargarían los días del mes anterior
    });
    
    // Evento para el botón siguiente
    nextButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendarTitle();
        // En una implementación real, aquí se cargarían los días del mes siguiente
    });
    
    // Manejo de teclas para navegación en el calendario
    const calendarDates = document.querySelectorAll('.calendar-date');
    calendarDates.forEach((date, index) => {
        date.addEventListener('keydown', (event) => {
            let targetDate;
            
            // Navegación con teclado dentro del calendario
            switch (event.key) {
                case 'ArrowRight':
                    event.preventDefault();
                    targetDate = calendarDates[index + 1];
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    targetDate = calendarDates[index - 1];
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    targetDate = calendarDates[index - 7]; // Subir una semana
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    targetDate = calendarDates[index + 7]; // Bajar una semana
                    break;
                case 'Home':
                    event.preventDefault();
                    // Ir al primer día del mes (o primer día visible)
                    targetDate = calendarDates[0];
                    break;
                case 'End':
                    event.preventDefault();
                    // Ir al último día del mes (o último día visible)
                    targetDate = calendarDates[calendarDates.length - 1];
                    break;
            }
            
            if (targetDate) {
                targetDate.focus();
            }
        });
        
        // En un sistema real, aquí se añadirían eventos para mostrar los detalles de las clases
        date.addEventListener('click', () => {
            // Simulación - en producción se mostraría un modal o panel con detalles
            const dateNumber = date.querySelector('.date-number').textContent;
            const events = date.querySelectorAll('.date-event');
            
            if (events.length) {
                let eventsList = [];
                events.forEach(event => eventsList.push(event.textContent));
                console.log(`Clases para el ${dateNumber} de octubre: ${eventsList.join(', ')}`);
            } else {
                console.log(`No hay clases programadas para el ${dateNumber} de octubre`);
            }
        });
    });
    
    // Inicializar el título
    updateCalendarTitle();
}

/**
 * Configura la accesibilidad del panel de administración
 * @returns {void}
 */
function setupAdminAccessibility() {
    // Gestión del enlace "Saltar al contenido"
    const skipLink = document.querySelector('.skip-to-admin');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.tabIndex = -1;
                targetElement.focus();
                
                // Restaurar después para no interferir con el orden de tabulación
                setTimeout(() => {
                    targetElement.removeAttribute('tabindex');
                }, 1000);
            }
        });
    }
}

/**
 * Inicializa acciones para manipulación de datos en el panel de administración
 * @returns {void}
 */
function initializeDataActions() {
    // Botones de filtrado
    const filterButtons = document.querySelectorAll('button.admin-btn.secondary:has(.fa-filter)');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // En producción, aquí se implementaría un sistema real de filtrado
            // Por ahora, solo es una simulación
            console.log('Filtrado activado');
            alert('Sistema de filtrado en desarrollo');
        });
    });
    
    // Botones para añadir
    const addButtons = document.querySelectorAll('button.admin-btn:has(.fa-plus)');
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            // En producción, aquí se abriría un modal o formulario para añadir
            // nuevo contenido (usuarios, clases, etc.)
            console.log('Formulario para añadir nuevo elemento');
            alert('Formulario en desarrollo');
        });
    });
    
    // Botones de acción en tabla
    const actionButtons = document.querySelectorAll('.action-buttons a');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const action = this.querySelector('i').classList.contains('fa-eye') ? 'ver' :
                          this.querySelector('i').classList.contains('fa-edit') ? 'editar' :
                          this.querySelector('i').classList.contains('fa-trash') ? 'eliminar' : 'acción desconocida';
            
            const userName = this.closest('tr').querySelector('.user-info div:nth-child(2)').textContent;
            
            console.log(`${action} usuario: ${userName}`);
            alert(`Acción: ${action} usuario ${userName}`);
        });
    });
}

/**
 * Muestra un mensaje de error en el panel de administración
 * @param {string} message - Mensaje de error para mostrar
 * @returns {void}
 */
function displayErrorMessage(message) {
    // En producción, aquí se implementaría un sistema para mostrar
    // mensajes de error en la interfaz
    console.error(message);
    
    // Crear y mostrar un mensaje visible solo si no existe ya uno
    if (!document.querySelector('.admin-error-message')) {
        const errorElement = document.createElement('div');
        errorElement.className = 'admin-error-message';
        errorElement.setAttribute('role', 'alert');
        errorElement.setAttribute('aria-live', 'assertive');
        errorElement.textContent = message;
        
        // Agregar al DOM
        const adminContent = document.querySelector('.admin-content');
        if (adminContent) {
            adminContent.prepend(errorElement);
            
            // Auto-eliminar después de un tiempo
            setTimeout(() => {
                errorElement.classList.add('fade-out');
                setTimeout(() => errorElement.remove(), 500);
            }, 5000);
        }
    }
} 