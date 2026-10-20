/**
 * ============================================================================
 * ARCHIVO: js_reservas.js
 * DESCRIPCIÓN: Lógica principal para la gestión de reservas de mesas (cuadrícula
 * estilo cine) y el sistema de pedidos conectados al MockAPI del equipo.
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------------------
    // 1. DECLARACIÓN DE ELEMENTOS DEL DOM Y VARIABLES GLOBALES
    // ------------------------------------------------------------------------
    const categoriesNav = document.getElementById('meal-categories-nav');
    const orderDishSelect = document.getElementById('order-dish');
    const resZone = document.getElementById('res-zone');
    const resDate = document.getElementById('res-date');
    const tableGridContainer = document.getElementById('table-grid-container');
    const selectedTableInput = document.getElementById('selected-table-input');
    const btnAddToCart = document.getElementById('btn-add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items-container');
    
    let currentMealsData = []; // Almacenará el menú completo obtenido del MockAPI
    let pedidoCarrito = [];    // Almacenará los platillos agregados temporalmente a la orden

    // Endpoint oficial del MockAPI del equipo para el menú
    const URLmenu = "https://6ad4090359dd78397bbc3aae.mockapi.io/terra/menu";
    
    // Obtener el usuario activo desde localStorage (con respaldo para invitado)
    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioLogueado')) || { id: 1, usuario: 'ClienteInvitado' };
    
    // Mostrar el nombre del usuario en los elementos de bienvenida y barra lateral
    const userGreetingName = document.getElementById('user-greeting-name');
    const sidebarUsername = document.getElementById('sidebar-username');
    if (userGreetingName) userGreetingName.textContent = usuarioActivo.usuario;
    if (sidebarUsername) sidebarUsername.textContent = usuarioActivo.usuario;

    // ------------------------------------------------------------------------
    // 2. FUNCIÓN AUXILIAR PARA CORREGIR RUTAS DE IMÁGENES
    // ------------------------------------------------------------------------
    /**
     * Asegura que la ruta de la imagen proveniente del MockAPI apunte correctamente
     * al directorio del proyecto considerando que estamos dentro de la carpeta /html/
     */
    function obtenerRutaImagen(imgStr) {
        if (!imgStr) return '';
        if (imgStr.startsWith('http') || imgStr.startsWith('https')) return imgStr;
        if (imgStr.startsWith('../')) return imgStr;
        // Si viene como 'img/coctel.png', le anteponemos '../' para subir desde /html/
        return `../${imgStr}`;
    }

    // ------------------------------------------------------------------------
    // 3. CARGA DE DATOS DESDE EL MOCKAPI Y GENERACIÓN DE CATEGORÍAS
    // ------------------------------------------------------------------------
    function loadMenuFromMockApi() {
        if (!orderDishSelect) return;
        orderDishSelect.innerHTML = '<option value="">Cargando platillos del menú...</option>';

        fetch(URLmenu)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    currentMealsData = data; 
                    
                    // Extraer categorías únicas de forma dinámica desde los datos de la API
                    const categoriasUnicas = [...new Set(data.map(item => item.categoria))];
                    
                    if (categoriesNav) {
                        categoriesNav.innerHTML = '';
                        categoriasUnicas.forEach(cat => {
                            const btn = document.createElement('button');
                            btn.type = 'button';
                            btn.className = 'btn btn-default btn-xs';
                            btn.textContent = cat;
                            btn.style.borderRadius = '15px';
                            btn.style.padding = '5px 12px';
                            btn.style.fontSize = '12px';
                            btn.style.margin = '2px';
                            
                            // Evento click para filtrar platillos según el botón de categoría presionado
                            btn.addEventListener('click', () => {
                                document.querySelectorAll('#meal-categories-nav button').forEach(b => {
                                    b.classList.remove('btn-primary');
                                    b.classList.add('btn-default');
                                });
                                btn.classList.remove('btn-default');
                                btn.classList.add('btn-primary');
                                
                                renderDishesByCategory(cat);
                            });
                            
                            categoriesNav.appendChild(btn);
                        });
                    }

                    // Seleccionar por defecto la primera categoría disponible
                    if (categoriasUnicas.length > 0) {
                        renderDishesByCategory(categoriasUnicas[0]);
                        if (categoriesNav.firstChild) {
                            categoriesNav.firstChild.classList.remove('btn-default');
                            categoriesNav.firstChild.classList.add('btn-primary');
                        }
                    }
                } else {
                    orderDishSelect.innerHTML = '<option value="">No hay platillos disponibles</option>';
                }
            })
            .catch(error => {
                console.error('Error al conectar con MockAPI:', error);
                orderDishSelect.innerHTML = '<option value="">Error al cargar el menú</option>';
            });
    }

    /**
     * Filtra los platillos del menú global según la categoría seleccionada
     * y los inserta en el elemento <select> desplegable.
     */
    function renderDishesByCategory(categoriaNombre) {
        if (!orderDishSelect) return;
        orderDishSelect.innerHTML = '<option value="">-- Selecciona un platillo --</option>';
        
        const previewContainer = document.getElementById('dish-preview-container');
        const placeholder = document.getElementById('dish-placeholder');
        if (previewContainer) previewContainer.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';

        const filtrados = currentMealsData.filter(item => item.categoria === categoriaNombre);
        
        filtrados.forEach(meal => {
            const option = document.createElement('option');
            option.value = meal.nombre;
            option.textContent = `${meal.nombre} ($${Number(meal.precio).toFixed(2)})`;
            orderDishSelect.appendChild(option);
        });
    }

    // Inicializar la carga del menú al iniciar la página
    loadMenuFromMockApi();

    // ------------------------------------------------------------------------
    // 4. PREVISUALIZACIÓN DE IMÁGENES AL SELECCIONAR UN PLATILLO
    // ------------------------------------------------------------------------
    if (orderDishSelect) {
        orderDishSelect.addEventListener('change', (e) => {
            const selectedMealName = e.target.value;
            const previewContainer = document.getElementById('dish-preview-container');
            const previewImg = document.getElementById('dish-preview-img');
            const placeholder = document.getElementById('dish-placeholder');

            if (!selectedMealName) {
                if (previewContainer) previewContainer.style.display = 'none';
                if (placeholder) placeholder.style.display = 'flex';
                return;
            }

            const mealFound = currentMealsData.find(m => m.nombre === selectedMealName);
            if (mealFound && previewContainer && previewImg && placeholder) {
                // Aplicar la corrección de ruta de imagen estandarizada
                previewImg.src = obtenerRutaImagen(mealFound.imagen);
                previewContainer.style.display = 'block';
                placeholder.style.display = 'none';
            }
        });
    }

    // ------------------------------------------------------------------------
    // 5. GESTIÓN DEL CARRITO TEMPORAL DE PEDIDOS
    // ------------------------------------------------------------------------
    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', () => {
            const dishName = orderDishSelect ? orderDishSelect.value : '';
            const qtyInput = document.getElementById('dish-qty');
            const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

            if (!dishName) {
                alert('Por favor selecciona un platillo del menú.');
                return;
            }

            const mealFound = currentMealsData.find(m => m.nombre === dishName);
            const imageThumb = mealFound ? obtenerRutaImagen(mealFound.imagen) : '';
            const precioPlato = mealFound ? Number(mealFound.precio) || 0 : 0;

            // Agregar el platillo seleccionado al arreglo del carrito temporal
            pedidoCarrito.push({
                nombre: dishName,
                precio: precioPlato,
                cantidad: quantity,
                imagen: imageThumb
            });

            renderCartItems();
            
            // Restablecer campos del formulario de orden
            orderDishSelect.value = '';
            if (qtyInput) qtyInput.value = 1;
            document.getElementById('dish-preview-container').style.display = 'none';
            document.getElementById('dish-placeholder').style.display = 'flex';
        });
    }

    /**
     * Renderiza los elementos agregados al carrito en el contenedor visual del HTML
     */
    function renderCartItems() {
        if (!cartItemsContainer) return;

        if (pedidoCarrito.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-muted" style="text-align: center; margin: 10px 0; font-size: 12px;">Ningún platillo agregado todavía.</p>';
            return;
        }

        let html = '<ul class="list-group" style="margin-bottom: 0;">';
        pedidoCarrito.forEach((item, index) => {
            html += `
                <li class="list-group-item" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 10px; font-size: 12px;">
                    <span><strong>${item.nombre}</strong> (Cant: ${item.cantidad}) - $${(item.precio * item.cantidad).toFixed(2)}</span>
                    <button type="button" class="btn btn-danger btn-xs" onclick="window.eliminarItemCarrito(${index})">&times;</button>
                </li>
            `;
        });
        html += '</ul>';
        cartItemsContainer.innerHTML = html;
    }

    // Función global para quitar un ítem específico del carrito temporal
    window.eliminarItemCarrito = function(index) {
        pedidoCarrito.splice(index, 1);
        renderCartItems();
    };

    // ------------------------------------------------------------------------
    // 6. CUADRÍCULA DE MESAS INTERACTIVA (ESTILO CINE)
    // ------------------------------------------------------------------------
    function renderTableGrid() {
        if (!tableGridContainer || !resZone || !resDate) return;
        
        const zone = resZone.value;
        const date = resDate.value;

        if (!zone || !date) {
            tableGridContainer.innerHTML = '<p class="text-muted" style="grid-column: span 4; text-align: center;">Selecciona una zona y fecha para ver las mesas</p>';
            return;
        }

        tableGridContainer.innerHTML = '';
        const totalTables = 12;
        const occupiedKey = `ocupadas_${date}_${zone}`;
        const occupiedTables = JSON.parse(localStorage.getItem(occupiedKey)) || [];

        // Generar dinámicamente los botones de las mesas
        for (let i = 1; i <= totalTables; i++) {
            const btnTable = document.createElement('button');
            btnTable.type = 'button';
            btnTable.className = 'btn btn-sm';
            btnTable.textContent = `Mesa ${i}`;
            
            if (occupiedTables.includes(i)) {
                // Mesa ocupada: deshabilitada y marcada en rojo
                btnTable.classList.add('btn-danger');
                btnTable.disabled = true;
                btnTable.style.cursor = 'not-allowed';
            } else {
                // Mesa libre: habilitada en verde, con evento de selección
                btnTable.classList.add('btn-success');
                btnTable.addEventListener('click', () => {
                    document.querySelectorAll('.table-btn-item').forEach(b => {
                        b.classList.remove('btn-warning');
                        b.classList.add('btn-success');
                    });
                    btnTable.classList.remove('btn-success');
                    btnTable.classList.add('btn-warning');
                    selectedTableInput.value = i;
                });
            }
            btnTable.classList.add('table-btn-item');
            tableGridContainer.appendChild(btnTable);
        }
    }

    // Escuchar cambios en zona y fecha para actualizar la disponibilidad en tiempo real
    if (resZone && resDate) {
        resZone.addEventListener('change', renderTableGrid);
        resDate.addEventListener('change', renderTableGrid);
    }

    // ------------------------------------------------------------------------
    // 7. GESTIÓN DE RESERVAS ACTIVAS Y ELIMINACIÓN CON LIBERACIÓN DE MESA
    // ------------------------------------------------------------------------
    function renderUserReservations() {
        const container = document.getElementById('user-active-reservations-list');
        if (!container) return;

        const historial = JSON.parse(localStorage.getItem('historialReservas')) || [];
        const misReservas = historial.filter(r => r.usuarioId === usuarioActivo.id || r.usuarioNombre === usuarioActivo.usuario);

        if (misReservas.length === 0) {
            container.innerHTML = '<p class="text-muted">No tienes reservas activas por el momento.</p>';
            return;
        }

        let html = '<div class="table-responsive"><table class="table table-bordered"><thead><tr><th>Fecha / Hora</th><th>Zona y Mesa</th><th>Platillos Ordenados</th><th>Estado</th><th>Acción</th></tr></thead><tbody>';
        
        misReservas.forEach(res => {
            let platillosTexto = 'Ninguno';
            if (res.platillos && Array.isArray(res.platillos) && res.platillos.length > 0) {
                platillosTexto = res.platillos.map(p => `${p.nombre} (x${p.cantidad})`).join(', ');
            } else if (res.platillo) {
                platillosTexto = `${res.platillo} (x${res.cantidad || 1})`;
            }

            const idUnico = res.idReserva || (res.fecha + '_' + res.mesa);

            html += `
                <tr>
                    <td><strong>${res.fecha}</strong><br>${res.hora || 'N/A'}</td>
                    <td>Zona: <strong>${res.zona ? res.zona.toUpperCase() : 'N/A'}</strong><br>Mesa: #${res.mesa || 'N/A'}</td>
                    <td>${platillosTexto}</td>
                    <td><span class="label label-success">${res.estado || 'Confirmada'}</span></td>
                    <td style="text-align: center;">
                        <button type="button" class="btn btn-danger btn-xs" onclick="window.eliminarReserva('${idUnico}')" title="Cancelar reserva">
                            <span class="glyphicon glyphicon-trash"></span> Eliminar
                        </button>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table></div>';
        container.innerHTML = html;
    }

    /**
     * Cancela la reserva seleccionada, elimina el registro del historial
     * y libera automáticamente la mesa en el localStorage de ocupadas.
     */
    window.eliminarReserva = function(idReserva) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta reserva?')) return;

        let historial = JSON.parse(localStorage.getItem('historialReservas')) || [];
        
        const reservaAEliminar = historial.find(r => {
            const currentId = r.idReserva || (r.fecha + '_' + r.mesa);
            return currentId === idReserva;
        });

        // Liberar la mesa correspondiente en el localStorage de ocupadas
        if (reservaAEliminar && reservaAEliminar.fecha && reservaAEliminar.zona && reservaAEliminar.mesa) {
            const occupiedKey = `ocupadas_${reservaAEliminar.fecha}_${reservaAEliminar.zona}`;
            let occupiedTables = JSON.parse(localStorage.getItem(occupiedKey)) || [];
            
            const mesaNum = parseInt(reservaAEliminar.mesa);
            occupiedTables = occupiedTables.filter(t => t !== mesaNum);
            
            localStorage.setItem(occupiedKey, JSON.stringify(occupiedTables));
        }

        // Filtrar el historial general descartando la reserva eliminada
        historial = historial.filter(r => {
            const currentId = r.idReserva || (r.fecha + '_' + r.mesa);
            return currentId !== idReserva;
        });

        localStorage.setItem('historialReservas', JSON.stringify(historial));
        
        renderUserReservations();
        
        // Refrescar visualmente la cuadrícula de mesas si se encuentra activa en pantalla
        const resDateInput = document.getElementById('res-date');
        const resZoneSelect = document.getElementById('res-zone');
        if (resDateInput && resZoneSelect && resDateInput.value && resZoneSelect.value) {
            const event = new Event('change');
            resZoneSelect.dispatchEvent(event);
        }
    };

    // Renderizar reservas iniciales del usuario al cargar el script
    renderUserReservations();

    // ------------------------------------------------------------------------
    // 8. CONFIRMACIÓN GENERAL Y PERSISTENCIA DE PEDIDO Y RESERVA
    // ------------------------------------------------------------------------
    const btnConfirmAll = document.getElementById('btn-confirm-all');
    if (btnConfirmAll) {
        btnConfirmAll.addEventListener('click', () => {
            const date = resDate ? resDate.value : '';
            const time = document.getElementById('res-time') ? document.getElementById('res-time').value : '';
            const zone = resZone ? resZone.value : '';
            const table = selectedTableInput ? selectedTableInput.value : '';

            // Validar campos obligatorios de la reserva
            if (!date || !time || !zone || !table) {
                alert('Por favor completa los datos de la mesa (fecha, hora, zona y selecciona una mesa en la cuadrícula).');
                return;
            }

            // Validar que el carrito contenga al menos un platillo
            if (pedidoCarrito.length === 0) {
                alert('Por favor agrega al menos un platillo a tu orden antes de finalizar.');
                return;
            }

            // Marcar la mesa como ocupada en el localStorage para esa fecha y zona
            const occupiedKey = `ocupadas_${date}_${zone}`;
            const occupiedTables = JSON.parse(localStorage.getItem(occupiedKey)) || [];
            if (!occupiedTables.includes(parseInt(table))) {
                occupiedTables.push(parseInt(table));
                localStorage.setItem(occupiedKey, JSON.stringify(occupiedTables));
            }

            // Construir el objeto de la nueva reserva unificada
            const nuevaReserva = {
                idReserva: 'res_' + Date.now(),
                usuarioId: usuarioActivo.id,
                usuarioNombre: usuarioActivo.usuario,
                fecha: date,
                hora: time,
                zona: zone,
                mesa: table,
                platillos: [...pedidoCarrito],
                estado: 'Confirmada'
            };

            // Guardar en el historial general del localStorage
            const historial = JSON.parse(localStorage.getItem('historialReservas')) || [];
            historial.push(nuevaReserva);
            localStorage.setItem('historialReservas', JSON.stringify(historial));

            alert('¡Tu reserva y orden han sido procesadas con éxito!');
            location.reload();
        });
    }
});