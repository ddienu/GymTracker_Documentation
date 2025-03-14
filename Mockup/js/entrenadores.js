'use strict';

/**
 * Inicialización del panel de entrenadores
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Inicialización de componentes
        initializeNavigation();
        initializeClassManagement();
        initializeStudentManagement();
        initializeWorkoutPlans();
        initializeCalendar();
        
        console.log('Panel de entrenadores inicializado correctamente');
    } catch (error) {
        console.error('Error al inicializar el panel de entrenadores:', error);
        showErrorMessage('Ocurrió un error al cargar la página. Por favor, recarga la página o contacta a soporte técnico.');
    }
});

/**
 * Inicialización de la navegación
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
 * Inicialización de la gestión de clases
 */
function initializeClassManagement() {
    const addClassBtn = document.getElementById('addClassBtn');
    const searchBox = document.querySelector('.class-management .search-box input');
    const classCards = document.querySelectorAll('.class-card');
    
    // Evento para añadir clase
    if (addClassBtn) {
        addClassBtn.addEventListener('click', function() {
            openClassModal('add');
        });
    }
    
    // Búsqueda de clases
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            filterClasses(this.value.toLowerCase());
        });
    }
    
    // Eventos para los botones de acción en las tarjetas de clase
    classCards.forEach(card => {
        const actionButtons = card.querySelectorAll('.action-btn');
        
        actionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.textContent.trim().toLowerCase().includes('detalles') ? 'view' : 'edit';
                const className = card.querySelector('h3').textContent;
                
                if (action === 'view') {
                    viewClassDetails(className);
                } else {
                    openClassModal('edit', className);
                }
            });
        });
    });
}

/**
 * Filtra las tarjetas de clases según el término de búsqueda
 * @param {string} searchTerm - Término de búsqueda
 */
function filterClasses(searchTerm) {
    const classCards = document.querySelectorAll('.class-card');
    
    classCards.forEach(card => {
        const className = card.querySelector('h3').textContent.toLowerCase();
        const classInfo = Array.from(card.querySelectorAll('.class-info p')).map(p => p.textContent.toLowerCase()).join(' ');
        
        if (className.includes(searchTerm) || classInfo.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Abre el modal para añadir o editar una clase
 * @param {string} mode - Modo del modal ('add' o 'edit')
 * @param {string} className - Nombre de la clase (solo para modo 'edit')
 */
function openClassModal(mode, className = '') {
    // En una implementación real, esto abriría un modal con formulario
    console.log(`Abriendo modal de clase en modo ${mode} ${mode === 'edit' ? `para ${className}` : ''}`);
    alert(`Función no implementada: ${mode === 'add' ? 'Crear nueva clase' : `Editar clase ${className}`}`);
}

/**
 * Muestra los detalles de una clase
 * @param {string} className - Nombre de la clase
 */
function viewClassDetails(className) {
    // En una implementación real, esto cargaría los detalles de la clase
    console.log(`Viendo detalles de la clase: ${className}`);
    alert(`Función no implementada: Ver detalles de ${className}`);
}

/**
 * Inicialización de la gestión de alumnos
 */
function initializeStudentManagement() {
    const addStudentBtn = document.getElementById('addStudentBtn');
    const searchBox = document.querySelector('.student-management .search-box input');
    const actionButtons = document.querySelectorAll('.student-management .action-btn');
    
    // Evento para añadir alumno
    if (addStudentBtn) {
        addStudentBtn.addEventListener('click', function() {
            openStudentModal('add');
        });
    }
    
    // Búsqueda de alumnos
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            filterStudents(this.value.toLowerCase());
        });
    }
    
    // Eventos para botones de acción
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('i').classList.contains('fa-eye') ? 'view' : 'edit';
            const studentName = this.closest('tr').querySelector('td').textContent;
            
            if (action === 'view') {
                viewStudentDetails(studentName);
            } else {
                openStudentModal('edit', studentName);
            }
        });
    });
}

/**
 * Filtra la tabla de alumnos según el término de búsqueda
 * @param {string} searchTerm - Término de búsqueda
 */
function filterStudents(searchTerm) {
    const rows = document.querySelectorAll('.student-management tbody tr');
    
    rows.forEach(row => {
        const name = row.querySelector('td').textContent.toLowerCase();
        const email = row.querySelectorAll('td')[1].textContent.toLowerCase();
        const classes = row.querySelectorAll('td')[2].textContent.toLowerCase();
        
        if (name.includes(searchTerm) || email.includes(searchTerm) || classes.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/**
 * Abre el modal para añadir o editar un alumno
 * @param {string} mode - Modo del modal ('add' o 'edit')
 * @param {string} studentName - Nombre del alumno (solo para modo 'edit')
 */
function openStudentModal(mode, studentName = '') {
    // En una implementación real, esto abriría un modal con formulario
    console.log(`Abriendo modal de alumno en modo ${mode} ${mode === 'edit' ? `para ${studentName}` : ''}`);
    alert(`Función no implementada: ${mode === 'add' ? 'Añadir nuevo alumno' : `Editar alumno ${studentName}`}`);
}

/**
 * Muestra los detalles de un alumno
 * @param {string} studentName - Nombre del alumno
 */
function viewStudentDetails(studentName) {
    // En una implementación real, esto cargaría los detalles del alumno
    console.log(`Viendo detalles del alumno: ${studentName}`);
    alert(`Función no implementada: Ver detalles de ${studentName}`);
}

/**
 * Inicialización de planes de entrenamiento
 */
function initializeWorkoutPlans() {
    const addPlanBtn = document.getElementById('addPlanBtn');
    const planCards = document.querySelectorAll('.plan-card');
    
    // Evento para añadir plan
    if (addPlanBtn) {
        addPlanBtn.addEventListener('click', function() {
            openPlanModal('add');
        });
    }
    
    // Eventos para los botones de acción en las tarjetas de planes
    planCards.forEach(card => {
        const actionButtons = card.querySelectorAll('.action-btn');
        
        actionButtons.forEach(button => {
            button.addEventListener('click', function() {
                const action = this.textContent.trim().toLowerCase().includes('ver') ? 'view' : 'edit';
                const planName = card.querySelector('h3').textContent;
                
                if (action === 'view') {
                    viewPlanDetails(planName);
                } else {
                    openPlanModal('edit', planName);
                }
            });
        });
    });
}

/**
 * Abre el modal para añadir o editar un plan de entrenamiento
 * @param {string} mode - Modo del modal ('add' o 'edit')
 * @param {string} planName - Nombre del plan (solo para modo 'edit')
 */
function openPlanModal(mode, planName = '') {
    // En una implementación real, esto abriría un modal con formulario
    console.log(`Abriendo modal de plan en modo ${mode} ${mode === 'edit' ? `para ${planName}` : ''}`);
    alert(`Función no implementada: ${mode === 'add' ? 'Crear nuevo plan' : `Editar plan ${planName}`}`);
}

/**
 * Muestra los detalles de un plan de entrenamiento
 * @param {string} planName - Nombre del plan
 */
function viewPlanDetails(planName) {
    // En una implementación real, esto cargaría los detalles del plan
    console.log(`Viendo detalles del plan: ${planName}`);
    alert(`Función no implementada: Ver detalles de plan ${planName}`);
}

/**
 * Inicialización del calendario
 */
function initializeCalendar() {
    const calendarButtons = document.querySelectorAll('.calendar-header button');
    const calendarDays = document.querySelectorAll('.calendar-day');
    
    // Navegación del calendario
    calendarButtons.forEach(button => {
        button.addEventListener('click', function() {
            const direction = this.querySelector('i').classList.contains('fa-chevron-left') ? 'prev' : 'next';
            navigateCalendar(direction);
        });
    });
    
    // Evento para los días del calendario
    calendarDays.forEach(day => {
        if (!day.textContent || day.style.opacity === '0.5') return;
        
        day.addEventListener('click', function() {
            viewDayClasses(this.textContent);
        });
    });
}

/**
 * Navega entre meses en el calendario
 * @param {string} direction - Dirección de navegación ('prev' o 'next')
 */
function navigateCalendar(direction) {
    // En una implementación real, esto actualizaría la vista del calendario
    console.log(`Navegando calendario: ${direction}`);
    alert(`Función no implementada: Navegar al ${direction === 'prev' ? 'mes anterior' : 'mes siguiente'}`);
}

/**
 * Muestra las clases de un día específico
 * @param {string} day - Día del mes
 */
function viewDayClasses(day) {
    // En una implementación real, esto mostraría las clases de ese día
    console.log(`Viendo clases del día: ${day}`);
    if (document.querySelector(`.calendar-day:nth-child(${parseInt(day) + 7})`).classList.contains('has-classes')) {
        alert(`Día ${day}: Tienes clases programadas para este día`);
    } else {
        alert(`Día ${day}: No hay clases programadas para este día`);
    }
}

/**
 * Muestra un mensaje de error
 * @param {string} message - Mensaje de error
 */
function showErrorMessage(message) {
    // Crear elemento para el mensaje de error
    const errorElement = document.createElement('div');
    errorElement.className = 'admin-error-message';
    errorElement.textContent = message;
    
    // Añadir al comienzo del contenido principal
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        mainContent.insertBefore(errorElement, mainContent.firstChild);
        
        // Eliminar automáticamente después de 5 segundos
        setTimeout(() => {
            errorElement.classList.add('fade-out');
            setTimeout(() => {
                if (errorElement.parentNode) {
                    errorElement.parentNode.removeChild(errorElement);
                }
            }, 500);
        }, 5000);
    }
} 