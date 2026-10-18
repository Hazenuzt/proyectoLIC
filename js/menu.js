//manejo de los paneles de menu
document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll(".menu-tab-btn");
    const panels = document.querySelectorAll(".category-block");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remover clase active de todos los botones y paneles
            tabs.forEach(t => t.classList.remove("active"));
            panels.forEach(p => p.classList.remove("active"));

            // Agregar clase active al botón presionado
            tab.classList.add("active");

            // Mostrar el panel correspondiente usando el atributo data-target
            const targetPanelId = tab.getAttribute("data-target");
            const targetPanel = document.getElementById(targetPanelId);
            if (targetPanel) {
                targetPanel.classList.add("active");
            }
        });
    });
});