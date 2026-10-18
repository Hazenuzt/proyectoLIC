document.addEventListener('DOMContentLoaded', () => {
    const categoriesNav = document.getElementById('meal-categories-nav');
    const orderDishSelect = document.getElementById('order-dish');
    const resZone = document.getElementById('res-zone');
    const resDate = document.getElementById('res-date');
    const tableGridContainer = document.getElementById('table-grid-container');
    const selectedTableInput = document.getElementById('selected-table-input');
    const btnAddToCart = document.getElementById('btn-add-to-cart');
    const cartItemsContainer = document.getElementById('cart-items-container');
    
    let currentMealsData = [];
    let pedidoCarrito = []; 

    const usuarioActivo = JSON.parse(localStorage.getItem('usuarioLogueado')) || { id: 1, usuario: 'ClienteInvitado' };
    
    const userGreetingName = document.getElementById('user-greeting-name');
    const sidebarUsername = document.getElementById('sidebar-username');
    if (userGreetingName) userGreetingName.textContent = usuarioActivo.usuario;
    if (sidebarUsername) sidebarUsername.textContent = usuarioActivo.usuario;

    // 1. Cargar categorías de TheMealDB
    if (categoriesNav) {
        fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
            .then(response => response.json())
            .then(data => {
                if (data.categories) {
                    categoriesNav.innerHTML = '';
                    data.categories.forEach(cat => {
                        const btn = document.createElement('button');
                        btn.type = 'button';
                        btn.className = 'btn btn-default btn-xs';
                        btn.textContent = cat.strCategory;
                        btn.style.borderRadius = '15px';
                        btn.style.padding = '5px 12px';
                        btn.style.fontSize = '12px';
                        btn.style.margin = '2px';
                        
                        btn.addEventListener('click', () => {
                            document.querySelectorAll('#meal-categories-nav button').forEach(b => {
                                b.classList.remove('btn-primary');
                                b.classList.add('btn-default');
                            });
                            btn.classList.remove('btn-default');
                            btn.classList.add('btn-primary');
                            
                            loadMealsByCategory(cat.strCategory);
                        });
                        
                        categoriesNav.appendChild(btn);
                    });
                }
            })
            .catch(error => console.error('Error al cargar categorías:', error));
    }

    function loadMealsByCategory(categoryName) {
        if (!orderDishSelect) return;
        orderDishSelect.innerHTML = '<option value="">Cargando platillos...</option>';
        
        const previewContainer = document.getElementById('dish-preview-container');
        const placeholder = document.getElementById('dish-placeholder');
        if (previewContainer) previewContainer.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';

        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoryName}`)
            .then(response => response.json())
            .then(data => {
                orderDishSelect.innerHTML = '<option value="">-- Selecciona un platillo --</option>';
                currentMealsData = [];
                
                if (data.meals) {
                    currentMealsData = data.meals;
                    data.meals.forEach(meal => {
                        const option = document.createElement('option');
                        option.value = meal.strMeal;
                        option.textContent = meal.strMeal;
                        orderDishSelect.appendChild(option);
                    });
                } else {
                    orderDishSelect.innerHTML = '<option value="">No hay platillos en esta categoría</option>';
                }
            })
            .catch(error => console.error('Error al cargar platillos:', error));
    }

    // Previsualizar imagen grande en la columna izquierda
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

            const mealFound = currentMealsData.find(m => m.strMeal === selectedMealName);
            if (mealFound && previewContainer && previewImg && placeholder) {
                previewImg.src = mealFound.strMealThumb;
                previewContainer.style.display = 'block';
                placeholder.style.display = 'none';
            }
        });
    }

    // 2. Agregar platillo al carrito temporal
    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', () => {
            const dishName = orderDishSelect ? orderDishSelect.value : '';
            const qtyInput = document.getElementById('dish-qty');
            const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

            if (!dishName) {
                alert('Por favor selecciona un platillo del menú.');
                return;
            }

            const mealFound = currentMealsData.find(m => m.strMeal === dishName);
            const imageThumb = mealFound ? mealFound.strMealThumb : '';

            pedidoCarrito.push({
                nombre: dishName,
                cantidad: quantity,
                imagen: imageThumb
            });

            renderCartItems();
            
            orderDishSelect.value = '';
            if (qtyInput) qtyInput.value = 1;
            document.getElementById('dish-preview-container').style.display = 'none';
            document.getElementById('dish-placeholder').style.display = 'flex';
        });
    }

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
                    <span><strong>${item.nombre}</strong> (Cant: ${item.cantidad})</span>
                    <button type="button" class="btn btn-danger btn-xs" onclick="window.eliminarItemCarrito(${index})">&times;</button>
                </li>
            `;
        });
        html += '</ul>';
        cartItemsContainer.innerHTML = html;
    }

    window.eliminarItemCarrito = function(index) {
        pedidoCarrito.splice(index, 1);
        renderCartItems();
    };

    // 3. Cuadrícula de Mesas estilo cine
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

        for (let i = 1; i <= totalTables; i++) {
            const btnTable = document.createElement('button');
            btnTable.type = 'button';
            btnTable.className = 'btn btn-sm';
            btnTable.textContent = `Mesa ${i}`;
            
            if (occupiedTables.includes(i)) {
                btnTable.classList.add('btn-danger');
                btnTable.disabled = true;
                btnTable.style.cursor = 'not-allowed';
            } else {
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

    if (resZone && resDate) {
        resZone.addEventListener('change', renderTableGrid);
        resDate.addEventListener('change', renderTableGrid);
    }

    // 4. Renderizar reservas activas con botón de eliminar
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

            // Usamos un identificador único (idReserva o creamos uno temporal basado en fecha/mesa si no tuviera)
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

    // Función global para eliminar una reserva del localStorage
    window.eliminarReserva = function(idReserva) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta reserva?')) return;

        let historial = JSON.parse(localStorage.getItem('historialReservas')) || [];
        
        // Filtramos para quitar la reserva seleccionada
        historial = historial.filter(r => {
            const currentId = r.idReserva || (r.fecha + '_' + r.mesa);
            return currentId !== idReserva;
        });

        localStorage.setItem('historialReservas', JSON.stringify(historial));
        
        // Volver a renderizar la tabla de reservas en tiempo real
        renderUserReservations();
    };

    renderUserReservations();

    // 5. Botón único de confirmación general
    const btnConfirmAll = document.getElementById('btn-confirm-all');
    if (btnConfirmAll) {
        btnConfirmAll.addEventListener('click', () => {
            const date = resDate ? resDate.value : '';
            const time = document.getElementById('res-time') ? document.getElementById('res-time').value : '';
            const zone = resZone ? resZone.value : '';
            const table = selectedTableInput ? selectedTableInput.value : '';

            if (!date || !time || !zone || !table) {
                alert('Por favor completa los datos de la mesa (fecha, hora, zona y selecciona una mesa en la cuadrícula).');
                return;
            }

            if (pedidoCarrito.length === 0) {
                alert('Por favor agrega al menos un platillo a tu orden antes de finalizar.');
                return;
            }

            const occupiedKey = `ocupadas_${date}_${zone}`;
            const occupiedTables = JSON.parse(localStorage.getItem(occupiedKey)) || [];
            if (!occupiedTables.includes(parseInt(table))) {
                occupiedTables.push(parseInt(table));
                localStorage.setItem(occupiedKey, JSON.stringify(occupiedTables));
            }

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

            const historial = JSON.parse(localStorage.getItem('historialReservas')) || [];
            historial.push(nuevaReserva);
            localStorage.setItem('historialReservas', JSON.stringify(historial));

            alert('¡Tu reserva y orden han sido procesadas con éxito!');
            location.reload();
        });
    }
});