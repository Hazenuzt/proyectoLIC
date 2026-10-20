//almacenamos el endpoint de la api correspondiente a la galeria:
const URLgaleria="https://6ad4090359dd78397bbc3aae.mockapi.io/terra/galeria";
//para mostrar el mensaje de error
const contenidoMostrar=document.getElementById("galeria-mensaje");
//para mostrar las imagenes en su respectivo contenedor
const grid=document.getElementById("gallery-grid-container")
//para modals de bootstrap
const modalFoto = new bootstrap.Modal(document.getElementById("modalFoto"));
const modalImg = document.getElementById("modalFotoImg");
const modalTitulo = document.getElementById("modalFotoTitulo");
const modalDesc = document.getElementById("modalFotoDesc");


//hacemos la petición AJAX a la API utilizando XMLHttpRequest
function pedirGaleria(){
    const xhr= new XMLHttpRequest();
    xhr.open('GET', URLgaleria, true);

    //se ejecuta cuando el servidor responde a la peticion
    xhr.onload=function(){
        if(xhr.status===200){
            //primero convertimos el texto obtenido de la api en un objeto de js
            const gale=JSON.parse(xhr.responseText);
            contenidoMostrar.innerHTML="";
            //llamamos a la función que habrá de insertar el contenido 
            insertarGaleria(gale);
        } else{
            contenidoMostrar.innerHTML='<p> Error al cargar el contenido </p>';
        }
    };

    xhr.onerror=function(){
        contenidoMostrar.innerHTML='<p> Error al cargar el contenido </p>';
    };

    xhr.send();
}

/*función para insertar las imágenes a la galeria, recordando que ya pasamos el contenido 
de la api a un objeto de js almacenado en gale*/
function insertarGaleria(fotitos){
    grid.innerHTML=fotitos.map( fotos=> `
        <div class="gallery-card">
            <div class="gallery-image-container">
                <img src="../${fotos.imagen}" alt="${fotos.tipoArea}">
            </div>
            <div class="gallery-card-content">
                <h3>${fotos.tipoArea}</h3>
                <p>${fotos.descripcion}</p>
            </div>
        </div>
        `).join("");
}

//función que detecta un click en el grid creado (el contenedor de la imagen) y ejecuta el modal
grid.addEventListener("click", function (e) {
    const img = e.target.closest(".gallery-image-container img");
    if (!img) return; // el clic no fue sobre una imagen

    const tarjeta = img.closest(".gallery-card");

    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalTitulo.textContent = tarjeta.querySelector("h3").textContent;
    modalDesc.textContent = tarjeta.querySelector("p").textContent;

    modalFoto.show();
});

//se pide el menu cuando el html carga
document.addEventListener("DOMContentLoaded", pedirGaleria);