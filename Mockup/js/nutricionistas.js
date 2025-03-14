'use strict';

/**
 * Inicialización del panel de nutricionistas
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Inicialización de componentes
        initializeNavigation();
        initializePatientManagement();
        initializeNutritionPlans();
        initializeAppointments();
        
        console.log('Panel de nutricionistas inicializado correctamente');
    } catch (error) {
        console.error('Error al inicializar el panel de nutricionistas:', error);
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
 * Inicialización de la gestión de pacientes
 */
function initializePatientManagement() {
    const addPatientBtn = document.getElementById('addPatientBtn');
    const searchBox = document.querySelector('.search-box input');
    const actionButtons = document.querySelectorAll('.patient-management .action-btn');
    
    // Evento para añadir paciente
    if (addPatientBtn) {
        addPatientBtn.addEventListener('click', function() {
            openPatientModal('add');
        });
    }
    
    // Búsqueda de pacientes
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            filterPatients(this.value.toLowerCase());
        });
    }
    
    // Eventos para botones de acción
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('i').classList.contains('fa-eye') ? 'view' : 'edit';
            const patientName = this.closest('tr').querySelector('td').textContent;
            
            if (action === 'view') {
                viewPatientDetails(patientName);
            } else {
                openPatientModal('edit', patientName);
            }
        });
    });
}

/**
 * Filtra la tabla de pacientes según el término de búsqueda
 * @param {string} searchTerm - Término de búsqueda
 */
function filterPatients(searchTerm) {
    const rows = document.querySelectorAll('.patient-management tbody tr');
    
    rows.forEach(row => {
        const name = row.querySelector('td').textContent.toLowerCase();
        const email = row.querySelectorAll('td')[1].textContent.toLowerCase();
        
        if (name.includes(searchTerm) || email.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/**
 * Abre el modal para añadir o editar un paciente
 * @param {string} mode - Modo del modal ('add' o 'edit')
 * @param {string} patientName - Nombre del paciente (solo para modo 'edit')
 */
function openPatientModal(mode, patientName = '') {
    // En una implementación real, esto abriría un modal con formulario
    console.log(`Abriendo modal de paciente en modo ${mode} ${mode === 'edit' ? `para ${patientName}` : ''}`);
    alert(`Función no implementada: ${mode === 'add' ? 'Añadir nuevo paciente' : `Editar paciente ${patientName}`}`);
}

/**
 * Muestra los detalles de un paciente
 * @param {string} patientName - Nombre del paciente
 */
function viewPatientDetails(patientName) {
    // En una implementación real, esto cargaría los detalles del paciente
    console.log(`Viendo detalles del paciente: ${patientName}`);
    alert(`Función no implementada: Ver detalles de ${patientName}`);
}

/**
 * Inicialización de planes de nutrición
 */
function initializeNutritionPlans() {
    const addPlanBtn = document.getElementById('addPlanBtn');
    const planActions = document.querySelectorAll('.plan-actions .action-btn');
    
    // Evento para añadir plan
    if (addPlanBtn) {
        addPlanBtn.addEventListener('click', function() {
            openPlanModal('add');
        });
    }
    
    // Eventos para botones de acción en planes
    planActions.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.textContent.trim().toLowerCase().includes('ver') ? 'view' : 'edit';
            const planName = this.closest('.plan-card').querySelector('h3').textContent;
            
            if (action === 'view') {
                viewPlanDetails(planName);
            } else {
                openPlanModal('edit', planName);
            }
        });
    });
}

/**
 * Abre el modal para añadir o editar un plan de nutrición
 * @param {string} mode - Modo del modal ('add' o 'edit')
 * @param {string} planName - Nombre del plan (solo para modo 'edit')
 */
function openPlanModal(mode, planName = '') {
    // En una implementación real, esto abriría un modal con formulario
    console.log(`Abriendo modal de plan en modo ${mode} ${mode === 'edit' ? `para ${planName}` : ''}`);
    alert(`Función no implementada: ${mode === 'add' ? 'Crear nuevo plan' : `Editar plan ${planName}`}`);
}

/**
 * Muestra los detalles de un plan de nutrición
 * @param {string} planName - Nombre del plan
 */
function viewPlanDetails(planName) {
    // En una implementación real, esto cargaría los detalles del plan
    console.log(`Viendo detalles del plan: ${planName}`);
    alert(`Función no implementada: Ver detalles de plan ${planName}`);
}

/**
 * Inicialización de citas
 */
function initializeAppointments() {
    const calendarButtons = document.querySelectorAll('.calendar-header button');
    const appointmentViewButtons = document.querySelectorAll('.appointment-actions .action-btn');
    
    // Navegación del calendario
    calendarButtons.forEach(button => {
        button.addEventListener('click', function() {
            const direction = this.querySelector('i').classList.contains('fa-chevron-left') ? 'prev' : 'next';
            navigateCalendar(direction);
        });
    });
    
    // Ver detalles de cita
    appointmentViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const appointmentDetails = this.closest('.appointment-card').querySelector('.appointment-details');
            const patientName = appointmentDetails.querySelector('h4').textContent;
            const appointmentType = appointmentDetails.querySelector('p').textContent;
            
            viewAppointmentDetails(patientName, appointmentType);
        });
    });
    
    // En una implementación real, aquí se cargaría el calendario
    // initializeCalendarView();
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
 * Muestra los detalles de una cita
 * @param {string} patientName - Nombre del paciente
 * @param {string} appointmentType - Tipo de cita
 */
function viewAppointmentDetails(patientName, appointmentType) {
    // En una implementación real, esto mostraría los detalles de la cita
    console.log(`Viendo detalles de cita: ${patientName} - ${appointmentType}`);
    alert(`Función no implementada: Ver detalles de cita de ${patientName}`);
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