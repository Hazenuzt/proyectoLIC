
/* Contenedor principal del modal */
.modal-content.form-card {
    border: none;
    border-radius: 12px;
    padding: 30px;
    position: relative;
    background-color: #ffffff;
}

/* Botón de cerrar de los modales */
.modal-content.form-card .btn-close {
    position: absolute;
    top: 25px;
    right: 25px;
    background: transparent;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0.7;
}

.modal-content.form-card .btn-close:hover {
    opacity: 1;
}

/* Título dentro de las tarjetas modales */
.modal-content.form-card .card-title {
    text-align: left;
    margin-bottom: 25px;
}

/* Filas internas del formulario modal */
.modal-content.form-card .custom-form .modal-form-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 15px;
}

.modal-content.form-card .custom-form .modal-form-row-lg {
    margin-bottom: 22px;
}

/* Etiquetas y campos de texto */
.modal-content.form-card .custom-form label {
    width: 100%;
    font-weight: 500;
    font-size: 0.95rem;
}

.modal-content.form-card .custom-form .form-control {
    width: 100%;
}

/* Botón de acción principal dentro del modal */
.modal-content.form-card .custom-form .btn-custom {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
}

/* Texto de pie de modal ("¿No tienes cuenta?") */
.modal-switch-text {
    text-align: center;
    margin-top: 20px;
    font-size: 0.9rem;
}

.modal-switch-text a {
    color: var(--color-primario);
    font-weight: 600;
    text-decoration: none;
}

.modal-switch-text a:hover {
    text-decoration: underline;
}
