document.addEventListener('DOMContentLoaded', () => {


    // 1. Datos de las especialidades  
    const especialidades = [
        {
            nombre: "Corte Gourmet Terra",
            descripcion: "Carne seleccionada a la parrilla acompañada de vegetales asados y papas rústicas.",
            imagen: "img/carneparillada.PNG"
        },
        {
            nombre: "Pasta en Salsa de Quesos",
            descripcion: "Pasta artesanal con salsa cremosa de cuatro quesos y toques de albahaca fresca.",
            imagen: "img/pasta de crema queso.PNG"
        },
        {
            nombre: "Tarta Especial de la Casa",
            descripcion: "Tarta artesanal con frutos rojos de la estación y helado de vainilla.",
            imagen: "img/tarta con frutos rojos.PNG"
        }
    ];

    const container = document.getElementById('highlights-container');

    if (container) {
        // Añadimos (mt-4) o (mt-5) para separar la sección del título hacia abajo
        container.className = "row justify-content-center g-4 px-3 mt-3";

        // Inyectamos las tarjetas
        container.innerHTML = especialidades.map(platillo => `
            <div class="col-12 col-md-4 d-flex justify-content-center">
                <div class="card h-100 border-0 shadow-sm" style="border-radius: 16px; overflow: hidden; background-color: #ffffff; max-width: 350px; width: 100%;">
                    <img src="${platillo.imagen}" class="card-img-top" alt="${platillo.nombre}" style="height: 220px; object-fit: cover;">
                    <div class="card-body p-4 text-start">
                        <h5 class="card-title fw-bold mb-2" style="color: #704214; font-family: serif; font-size: 1.25rem;">${platillo.nombre}</h5>
                        <p class="card-text text-muted mb-0" style="font-size: 0.9rem; line-height: 1.4;">${platillo.descripcion}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }
});