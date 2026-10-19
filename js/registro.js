//Se utiliza un DOM para los modales de ventana emergente de ingreso y registro de usuario
document.addEventListener("DOMContentLoaded", () => {
    const modalHTML = `
    <!-- VENTANA EMERGENTE (MODAL) DE INGRESAR -->
<div class="modal fade" id="loginModal" tabindex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" style="max-width: 480px;">
        <div class="modal-content form-card" style="border: none; border-radius: 12px; padding: 30px; position: relative;">
            
            <!-- Botón de cerrar nativo -->
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" style="position: absolute; top: 25px; right: 25px; background: transparent; border: none; font-size: 1.2rem; cursor: pointer; opacity: 0.7;"></button>
            
            <h3 class="card-title" style="text-align: left; margin-bottom: 25px;">Ingresar a Terra</h3>
            
            <form id="loginForm" class="custom-form">
                <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px;">
                    <label for="login-email" style="width: 100%; font-weight: 500; font-size: 0.95rem;">Correo electrónico</label>
                    <input type="email" id="login-email" class="form-control" required placeholder="correo@ejemplo.com" style="width: 100%;">
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 24px;">
                    <label for="login-password" style="width: 100%; font-weight: 500; font-size: 0.95rem;">Contraseña</label>
                    <input type="password" id="login-password" class="form-control" required minlength="8" placeholder="********" style="width: 100%;">
                </div>

                <div class="form-action" style="margin-top: 10px;">
                    <button type="submit" class="btn-custom" style="width: 100%; padding: 12px; font-size: 1rem;">Iniciar Sesión</button>
                </div>

                <div style="text-align: center; margin-top: 20px; font-size: 0.9rem;">
                    <span>¿No tienes cuenta? </span>
                    <a href="#" id="switchToRegister" style="color: var(--color-primario); font-weight: 600; text-decoration: none;">Regístrate aquí</a>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- VENTANA EMERGENTE (MODAL) DE REGISTRO -->
<div class="modal fade" id="registerModal" tabindex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" style="max-width: 480px;">
        <div class="modal-content form-card" style="border: none; border-radius: 12px; padding: 30px; position: relative;">
            
            <!-- Botón de cerrar nativo -->
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar" style="position: absolute; top: 25px; right: 25px; background: transparent; border: none; font-size: 1.2rem; cursor: pointer; opacity: 0.7;"></button>
            
            <h3 class="card-title" style="text-align: left; margin-bottom: 25px;">Crear una cuenta</h3>
            
            <form id="registerForm" class="custom-form">
                <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 15px;">
                    <label for="reg-name" style="width: 100%; font-weight: 500; font-size: 0.95rem;">Nombre Completo</label>
                    <input type="text" id="reg-name" class="form-control" required placeholder="Usuario" style="width: 100%;">
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 15px;">
                    <label for="reg-email" style="width: 100%; font-weight: 500; font-size: 0.95rem;">Correo electrónico</label>
                    <input type="email" id="reg-email" class="form-control" required placeholder="correo@ejemplo.com" style="width: 100%;">
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 15px;">
                    <label for="reg-phone" style="width: 100%; font-weight: 500; font-size: 0.95rem;">Número de Teléfono</label>
                    <input type="tel" id="reg-phone" class="form-control" required maxlength="9" style="width: 100%;">
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 15px;">
                    <label for="reg-password" style="width: 100%; font-weight: 500; font-size: 0.95rem;">Contraseña</label>
                    <input type="password" id="reg-password" class="form-control" required minlength="8" placeholder="********" style="width: 100%;">
                </div>

                <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 22px;">
                    <label for="reg-confirm-password" style="width: 100%; font-weight: 500; font-size: 0.95rem;">Confirmar Contraseña</label>
                    <input type="password" id="reg-confirm-password" class="form-control" required minlength="8" placeholder="********" style="width: 100%;">
                </div>

                <div class="form-action" style="margin-top: 10px;">
                    <button type="submit" class="btn-custom" style="width: 100%; padding: 12px; font-size: 1rem;">Registrarse</button>
                </div>
            </form>
        </div>
    </div>
</div>
    `;

    // Creamos un contenedor y lo añadimos al body
    const div = document.createElement('div');
    div.innerHTML = modalHTML;
    document.body.appendChild(div);
});


document.addEventListener('DOMContentLoaded', () => {
    // 1. Actualizar los menus  y la vista al perfil de usuario
    updateUserInterface();
    loadProfileData();

    // 2. Funcion del boton usuario dependiendo del estado
    const desktopUserBtn = document.getElementById('desktopUserBtn');
    const sidebarUserBlock = document.querySelector('.user-profile-desktop');

    function handleGlobalUserClick(e) {
        e.preventDefault();
        const loggedUser = localStorage.getItem('terra_logged_in_user');

        if (loggedUser) {
            // Si ya esta Ingresado ir al perfil
            window.location.href = 'perfil.html';
        } else {
            // Si aun no ingresa que se registre
            const loginModalEl = document.getElementById('loginModal');
            if (loginModalEl) {
                const loginModal = bootstrap.Modal.getOrCreateInstance(loginModalEl);
                loginModal.show();
            }
        }
    }

    if (desktopUserBtn) desktopUserBtn.addEventListener('click', handleGlobalUserClick);
    if (sidebarUserBlock) sidebarUserBlock.addEventListener('click', handleGlobalUserClick);

    // 3. Cambio de la ventana Ingreso a la ventana de registro
    const switchToRegister = document.getElementById('switchToRegister');
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            const loginModalEl = document.getElementById('loginModal');
            const registerModalEl = document.getElementById('registerModal');
            
            if (loginModalEl) {
                const loginInstance = bootstrap.Modal.getInstance(loginModalEl);
                if (loginInstance) loginInstance.hide();
            }
            
            if (registerModalEl) {
                const registerModal = bootstrap.Modal.getOrCreateInstance(registerModalEl);
                registerModal.show();
            }
        });
    }

    // 4. Logica de Registro
    const registerForm = document.getElementById('registerForm') || document.getElementById('global-register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const phone = document.getElementById('reg-phone').value.trim();
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            if (password.length < 8) {
                alert('La contraseña debe tener al menos 8 caracteres.');
                return;
            }

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden. Por favor, verifícalas.');
                return;
            }

            let users = JSON.parse(localStorage.getItem('terra_registered_users')) || [];

            if (users.some(u => u.email === email)) {
                alert('Este correo ya está registrado. Por favor inicia sesión.');
                return;
            }

            const initials = getInitials(name);
            const newUser = { name, email, phone, password, initials };

            users.push(newUser);
            localStorage.setItem('terra_registered_users', JSON.stringify(users));
            localStorage.setItem('terra_logged_in_user', JSON.stringify(newUser));

            alert('¡Cuenta creada y registrada con éxito!');
            
            const registerModalEl = document.getElementById('registerModal');
            const modalInstance = bootstrap.Modal.getInstance(registerModalEl);
            if (modalInstance) modalInstance.hide();

            updateUserInterface();
            window.location.href = 'perfil.html';
        });
    }

    // 5.logica de Inicio de sesion
    const loginForm = document.getElementById('loginForm') || document.getElementById('global-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            if (password.length < 8) {
                alert('La contraseña debe tener al menos 8 caracteres.');
                return;
            }

            let users = JSON.parse(localStorage.getItem('terra_registered_users')) || [];
            const foundUser = users.find(u => u.email === email && u.password === password);

            if (foundUser) {
                localStorage.setItem('terra_logged_in_user', JSON.stringify(foundUser));
                alert(`¡Bienvenido de nuevo, ${foundUser.name}!`);
                
                const loginModalEl = document.getElementById('loginModal');
                const modalInstance = bootstrap.Modal.getInstance(loginModalEl);
                if (modalInstance) modalInstance.hide();

                updateUserInterface();
                window.location.href = 'perfil.html';
            } else {
                alert('Correo o contraseña incorrectos, o la cuenta no existe.');
            }
        });
    }

    // 6.Formato del numero de telefono para que sea 0000-0000
    const phoneInput = document.getElementById('reg-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.substring(0, 8);
            if (value.length > 4) {
                e.target.value = value.substring(0, 4) + '-' + value.substring(4);
            } else {
                e.target.value = value;
            }
        });
    }

    // 7. Funcion del boton cerrar Sesión (la cuenta sigue guardada, solo oculta sesión actual)
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('terra_logged_in_user');
            alert('Has cerrado sesión correctamente.');
            window.location.href = '../index.html';
        });
    }

    // 8. Boton para editar el perfil
    let isEditing = false;
    const editProfileBtn = document.getElementById('edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            let loggedUser = JSON.parse(localStorage.getItem('terra_logged_in_user'));
            if (!loggedUser) return;

            const emailDisplay = document.getElementById('profile-email-display');
            const phoneDisplay = document.getElementById('profile-phone-display');

            if (!isEditing) {
                // --- activacion de Edicion, se ponen como textbox ---
                emailDisplay.innerHTML = `<input type="email" id="input-edit-email" class="form-control form-control-sm" value="${loggedUser.email}">`;
                phoneDisplay.innerHTML = `<input type="tel" id="input-edit-phone" class="form-control form-control-sm" value="${loggedUser.phone || ''}" maxlength="9" placeholder="0000-0000">`;
                
                editProfileBtn.textContent = 'Guardar Cambios';
                editProfileBtn.style.backgroundColor = 'var(--color-primario)';
                isEditing = true;

            } else {
                // --- guardar los cambios---
                const newEmail = document.getElementById('input-edit-email').value.trim();
                const newPhone = document.getElementById('input-edit-phone').value.trim();

                if (!newEmail) {
                    alert('El correo electrónico no puede estar vacío.');
                    return;
                }

                loggedUser.email = newEmail;
                loggedUser.phone = newPhone;

                // se actualiza la sesion en el localstorage
                localStorage.setItem('terra_logged_in_user', JSON.stringify(loggedUser));

                //se actualizan los usuarios
                let users = JSON.parse(localStorage.getItem('terra_registered_users')) || [];
                users = users.map(u => u.name === loggedUser.name ? loggedUser : u);
                localStorage.setItem('terra_registered_users', JSON.stringify(users));

                alert('¡Perfil actualizado con éxito!');
                
                isEditing = false;
                editProfileBtn.textContent = 'Editar Perfil';
                editProfileBtn.style.backgroundColor = ''; 
                
                loadProfileData();
            }
        });
    }

    // Para el numero de telefono al editar, se formatea al mismo tiempo a 0000-0000
    document.addEventListener('input', (e) => {
        if (e.target && e.target.id === 'input-edit-phone') {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.substring(0, 8);
            if (value.length > 4) {
                e.target.value = value.substring(0, 4) + '-' + value.substring(4);
            } else {
                e.target.value = value;
            }
        }
    });

    // 9. Boton eliminar perfil definitivamente
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            if (confirm('¿Estás segura de que deseas eliminar tu perfil definitivamente? Esta acción no se puede deshacer.')) {
                let loggedUser = JSON.parse(localStorage.getItem('terra_logged_in_user'));
                if (!loggedUser) return;

                let users = JSON.parse(localStorage.getItem('terra_registered_users')) || [];
                users = users.filter(u => u.email !== loggedUser.email);
                localStorage.setItem('terra_registered_users', JSON.stringify(users));

                localStorage.removeItem('terra_logged_in_user');

                alert('Tu perfil ha sido eliminado definitivamente.');
                window.location.href = '../index.html';
            }
        });
    }
});

// Funcion auxiliar para extraer las iniciales para el perfil
function getInitials(fullName) {
    if (!fullName) return 'US';
    const words = fullName.trim().split(/\s+/);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    } else if (words.length === 1 && words[0].length >= 2) {
        return words[0].substring(0, 2).toUpperCase();
    } else if (words.length === 1 && words[0].length === 1) {
        return words[0].toUpperCase();
    }
    return 'US';
}

// Cargar datos en la pagina perfil
function loadProfileData() {
    const loggedUser = JSON.parse(localStorage.getItem('terra_logged_in_user'));
    if (!loggedUser) return;

    const nameDisplay = document.getElementById('profile-name-display');
    const emailDisplay = document.getElementById('profile-email-display');
    const phoneDisplay = document.getElementById('profile-phone-display');
    const initialsContainer = document.getElementById('profile-initials');

    if (nameDisplay) nameDisplay.textContent = loggedUser.name;
    if (emailDisplay) emailDisplay.textContent = loggedUser.email;
    if (phoneDisplay) phoneDisplay.textContent = loggedUser.phone || 'No especificado';
    
    if (initialsContainer) {
        const initials = getInitials(loggedUser.name);
        initialsContainer.innerHTML = `<span style="font-weight: bold; color: var(--color-primario); font-size: 2rem;">${initials}</span>`;
    }
}

// Actualizacion de los menus con nombre e iniciales
function updateUserInterface() {
    const loggedUser = JSON.parse(localStorage.getItem('terra_logged_in_user'));
    const sidebarUserContainer = document.querySelector('.user-profile-desktop'); 
    const desktopUserBtn = document.getElementById('desktopUserBtn'); 

    if (loggedUser) {
        const initials = getInitials(loggedUser.name);

        //menu lateral
        if (sidebarUserContainer) {
            sidebarUserContainer.innerHTML = `
                <div class="d-flex align-items-center gap-2" style="cursor: pointer;" onclick="window.location.href='perfil.html'">
                    <div class="rounded-circle bg-white text-dark d-flex align-items-center justify-content-center fw-bold shadow-sm" style="width: 40px; height: 40px; border: 1px solid var(--color-secundario); color: var(--color-primario);">
                        ${initials}
                    </div>
                    <div>
                        <span class="fw-bold d-block" style="color: var(--color-primario);">${loggedUser.name}</span>
                        <small class="text-muted" style="font-size: 0.8rem;">Ver Perfil</small>
                    </div>
                </div>
            `;
        }

        // menu para compu
        if (desktopUserBtn) {
            desktopUserBtn.innerHTML = `
                <div class="d-inline-flex align-items-center gap-2" style="cursor: pointer;" onclick="window.location.href='perfil.html'">
                    <span class="rounded-circle bg-white text-dark d-inline-flex align-items-center justify-content-center fw-bold shadow-sm" style="width: 32px; height: 32px; font-size: 0.85rem; border: 1px solid var(--color-secundario); color: var(--color-primario);">${initials}</span>
                    <span>${loggedUser.name}</span>
                </div>
            `;
        }
    }
}

