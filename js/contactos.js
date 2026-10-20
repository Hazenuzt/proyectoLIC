// Esperar a que cargue la página y obtener los elementos del formulario por su ID
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const inputName = document.getElementById('contact-name');
    const inputEmail = document.getElementById('contact-email');
    const inputSubject = document.getElementById('contact-subject');
    const inputMessage = document.getElementById('contact-message');

    // Expresión regular para validar el correo electrónico
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Función para mostrar mensajes de estado/alerta
    function showAlert(message, type = 'danger') {
        // Remover alerta previa si existe
        const existingAlert = document.getElementById('form-alert');
        if (existingAlert) existingAlert.remove();

        //elemento de alerta usando clases de Bootstrap
        const alertDiv = document.createElement('div');
        alertDiv.id = 'form-alert';
        alertDiv.className = `alert alert-${type} alert-dismissible fade show mt-3`;
        alertDiv.role = 'alert';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        contactForm.prepend(alertDiv);
    }

    // Evento al enviar el formulario
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Evitar la recarga de la página.

        const nameValue = inputName.value.trim();
        const emailValue = inputEmail.value.trim();
        const subjectValue = inputSubject.value.trim();
        const messageValue = inputMessage.value.trim();

        //1-Validar que los campos no estén vacíos
        if (!nameValue || !emailValue || !subjectValue || !messageValue) {
            showAlert('Por favor, completa todos los campos del formulario.', 'danger');
            return;
        }

        //2-Validar formato de correo electrónico
        if (!emailRegex.test(emailValue)) {
            showAlert('Por favor, ingresa un correo electrónico válido (ejemplo: usuario@dominio.com).', 'warning');
            inputEmail.focus();
            return;
        }

        //3-Validar longitud mínima del mensaje (opcional)
        if (messageValue.length < 10) {
            showAlert('El mensaje debe contener al menos 10 caracteres.', 'warning');
            inputMessage.focus();
            return;
        }

        // Si todo está correcto:
        showAlert('¡Gracias por contactarnos! Tu mensaje ha sido enviado con éxito.', 'success');
        
        // Limpiar el formulario
        contactForm.reset();
    });
});
