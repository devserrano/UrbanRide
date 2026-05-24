function mostrarSeccion(idSeccion) {

    const secciones = document.querySelectorAll('.seccion');
    const botones = document.querySelectorAll('.sidebar button[data-seccion]');

    secciones.forEach((seccion) => {
        seccion.classList.add('oculto');
    });

    document
        .getElementById(idSeccion)
        .classList.remove('oculto');

    botones.forEach((boton) => {
        boton.classList.remove('activo-menu');
    });

    const botonActivo = document.querySelector(
        `.sidebar button[data-seccion="${idSeccion}"]`
    );

    if (botonActivo) {
        botonActivo.classList.add('activo-menu');
    }
}