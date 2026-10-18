//almacenamos el endpoint de la api correspondiente al menu:
const URLmenu="https://6ad4090359dd78397bbc3aae.mockapi.io/terra/menu";
//para mostrar el mensaje de error
const contenidoMostrar=document.getElementById("menu-mensaje");
/*relacionamos la categoria de los elementos del menu contenidos en la api
(PlatilloFuerte, Postres, Bebidas) con su respectivo elemento en el html*/
const contenedores ={
    PlatilloFuerte: "grid-fuertes",
    Postres:"grid-postres",
    Bebidas:"grid-bebidas"
};

//hacemos la petición AJAX a la API utilizando XMLHttpRequest
function pedirMenu(){
    const xhr= new XMLHttpRequest();
    xhr.open('GET', URLmenu, true);

    //se ejecuta cuando el servidor responde a la peticion
    xhr.onload=function(){
        if(xhr.status===200){
            //primero convertimos el texto obtenido de la api en un objeto de js
            const menucito=JSON.parse(xhr.responseText);
            contenidoMostrar.innerHTML="";
            //llamamos a la función que habrá de insertar el contenido a la tabla
            insertarMenu(menucito);
        } else{
            contenidoMostrar.innerHTML='<p> Error al cargar el contenido </p>';
        }
    };

    xhr.onerror=function(){
        contenidoMostrar.innerHTML='<p> Error al cargar el contenido </p>';
    };

    xhr.send();
}

/*función para insertar los platillos al menú, recordando que ya pasamos el contenido 
de la api a un objeto de js almacenado en menucito*/
function insertarMenu(menus){
    //vamos a recorrer el objeto por cada elemento encontrado de la categoría seleccionada 
    menus.forEach(p => {
        const contenedor =document.getElementById(contenedores[p.categoria]);
        //va a ignorar si encuentra una categoría mal escrita
        if (!contenedor)  return;
        contenedor.innerHTML +=`
            <div class="col-6 col-md-4 dish-card">
                <img src="../${p.imagen}" alt="${p.nombre}" class="img-fluid mx-auto d-block">
                <h4 class="dish-title">${p.nombre}</h4>
                <p class="dish-desc d-none d-md-block">${p.descripcion}</p>
                <span class="dish-price">$${Number(p.precio).toFixed(2)}</span>
            </div>
            `
    });
}

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

//se pide el menu cuando el html carga
document.addEventListener("DOMContentLoaded", pedirMenu);