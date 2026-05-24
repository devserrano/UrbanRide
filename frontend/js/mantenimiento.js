console.log('mantenimiento.js cargado');

const btnAgregarMantenimiento = document.getElementById(
    'btnAgregarMantenimiento'
);

const btnCancelarMantenimiento = document.getElementById(
    'btnCancelarMantenimiento'
);

const btnGuardarMantenimiento = document.getElementById(
    'btnGuardarMantenimiento'
);

btnAgregarMantenimiento.addEventListener('click', async () => {

    await cargarVehiculosMantenimiento();

    document
        .getElementById('modalMantenimiento')
        .classList.remove('oculto');

});

btnCancelarMantenimiento.addEventListener('click', () => {

    document
        .getElementById('modalMantenimiento')
        .classList.add('oculto');

});

async function cargarVehiculosMantenimiento() {

    const respuesta = await fetch(
        'http://localhost:3000/api/vehiculos'
    );

    const vehiculos = await respuesta.json();

    const select = document.getElementById(
        'selectVehiculoMantenimiento'
    );

    select.innerHTML = '';

    vehiculos.forEach((vehiculo) => {

        select.innerHTML += `
            <option value="${vehiculo.id}">
                ${vehiculo.unidad}
            </option>
        `;

    });

}

btnGuardarMantenimiento.addEventListener('click', async () => {

    const vehiculo_id = document.getElementById(
        'selectVehiculoMantenimiento'
    ).value;

    const servicio = document.getElementById(
        'selectServicioMantenimiento'
    ).value;

    const costo = document.getElementById(
        'inputCostoMantenimiento'
    ).value;

    const estado = document.getElementById(
        'selectEstadoMantenimiento'
    ).value;

    const observaciones = document.getElementById(
        'inputObservacionesMantenimiento'
    ).value.trim();

    if (!costo) {
        alert('El costo es obligatorio');
        return;
    }

    try {

        await fetch(
            'http://localhost:3000/api/mantenimientos',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    vehiculo_id,
                    servicio,
                    costo,
                    estado,
                    observaciones
                })
            }
        );

        document.getElementById('inputCostoMantenimiento').value = '';
        document.getElementById('inputObservacionesMantenimiento').value = '';

        document
            .getElementById('modalMantenimiento')
            .classList.add('oculto');

        obtenerMantenimientos();

    } catch (error) {

        console.error(
            'Error al guardar mantenimiento:',
            error
        );

    }

});

async function obtenerMantenimientos() {

    try {

        const respuesta = await fetch(
            'http://localhost:3000/api/mantenimientos'
        );

        const mantenimientos = await respuesta.json();

        actualizarCardsMantenimiento(mantenimientos);

        const contenedor = document.getElementById(
            'contenedorMantenimientos'
        );

        contenedor.innerHTML = '';

        mantenimientos.forEach((mantenimiento) => {

            contenedor.innerHTML += `
                <tr>

                    <td>
                        ${new Date(mantenimiento.fecha).toLocaleString('es-MX', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </td>

                    <td>${mantenimiento.unidad}</td>

                    <td>${mantenimiento.servicio}</td>

                    <td>$${Number(mantenimiento.costo).toFixed(2)}</td>

                    <td>
                        <span class="resultado ${mantenimiento.estado.toLowerCase().replaceAll(' ', '-')}">
                            ${mantenimiento.estado}
                        </span>
                    </td>

                    <td>${mantenimiento.observaciones || '-'}</td>

                </tr>
            `;

        });

    } catch (error) {

        console.error(
            'Error al obtener mantenimientos:',
            error
        );

    }

}

function actualizarCardsMantenimiento(mantenimientos) {

    const total = mantenimientos.length;

    const pendientes = mantenimientos.filter(
        mantenimiento => mantenimiento.estado.toLowerCase() === 'pendiente'
    ).length;

    const finalizados = mantenimientos.filter(
        mantenimiento => mantenimiento.estado.toLowerCase() === 'finalizado'
    ).length;

    const gastoTotal = mantenimientos.reduce(
        (suma, mantenimiento) => suma + Number(mantenimiento.costo),
        0
    );

    document.getElementById('totalMantenimientos').textContent = total;
    document.getElementById('pendientesMantenimiento').textContent = pendientes;
    document.getElementById('finalizadosMantenimiento').textContent = finalizados;
    document.getElementById('gastoTotal').textContent = `$${gastoTotal.toFixed(2)}`;

}

obtenerMantenimientos();