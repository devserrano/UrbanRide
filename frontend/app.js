async function obtenerVehiculos() {

    try {

        const respuesta = await fetch(
            'http://localhost:3000/api/vehiculos'
        );

        const vehiculos = await respuesta.json();

        console.log(vehiculos);

        actualizarDashboard(vehiculos);

        const contenedor = document.getElementById(
            'contenedorVehiculos'
        );

        contenedor.innerHTML = '';

        vehiculos.forEach((vehiculo) => {

            contenedor.innerHTML += `
                <tr>
                    <td>${vehiculo.id}</td>
                    <td>${vehiculo.unidad}</td>
                    <td>${vehiculo.tipo}</td>
                    <td>
                        <span class="estado ${vehiculo.estado.toLowerCase().replaceAll(' ', '-')}">
                            ${vehiculo.estado}
                        </span>
                    </td>
                    <td>
                        <button class="btn-editar" onclick="editarVehiculo(${vehiculo.id})">
                            Editar
                        </button>

                        <button class="btn-eliminar" onclick="eliminarVehiculo(${vehiculo.id})">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;

        });

    } catch (error) {

        console.error(
            'Error al obtener vehículos:',
            error
        );

    }

}

obtenerVehiculos();

async function eliminarVehiculo(id) {

    const confirmar = confirm(
        '¿Seguro que deseas eliminar este vehículo?'
    );

    if (!confirmar) {
        return;
    }

    try {

        await fetch(`http://localhost:3000/api/vehiculos/${id}`, {
            method: 'DELETE'
        });

        obtenerVehiculos();

    } catch (error) {

        console.error(
            'Error al eliminar vehículo:',
            error
        );

    }

}

function editarVehiculo(id) {

    const modal = document.getElementById('modalEstado');

    modal.setAttribute('data-id', id);

    console.log(
        'ID guardado en modal:',
        modal.getAttribute('data-id')
    );

    modal.classList.remove('oculto');

}

async function agregarVehiculo() {

    const unidad = prompt(
        'Ingresa la unidad:'
    );

    const tipo = prompt(
        'Ingresa el tipo:'
    );

    const estado = prompt(
        'Ingresa el estado:'
    );

    if (!unidad || !tipo || !estado) {

        alert('Todos los campos son obligatorios');

        return;
    }

    try {

        await fetch(
            'http://localhost:3000/api/vehiculos',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    unidad,
                    tipo,
                    estado
                })
            }
        );

        obtenerVehiculos();

    } catch (error) {

        console.error(
            'Error al agregar vehículo:',
            error
        );

    }

}

const btnAgregar = document.getElementById(
    'btnAgregar'
);

btnAgregar.addEventListener(
    'click',
    agregarVehiculo
);

function actualizarDashboard(vehiculos) {

    const total = vehiculos.length;

    const activos = vehiculos.filter(
        vehiculo => vehiculo.estado.toLowerCase() === 'activo'
    ).length;

    const mantenimiento = vehiculos.filter(
        vehiculo => vehiculo.estado.toLowerCase() === 'en mantenimiento'
    ).length;

    const descompuestos = vehiculos.filter(
        vehiculo => vehiculo.estado.toLowerCase() === 'descompuesto'
    ).length;

    document.getElementById('totalVehiculos').textContent = total;
    document.getElementById('vehiculosActivos').textContent = activos;
    document.getElementById('vehiculosMantenimiento').textContent = mantenimiento;
    document.getElementById('vehiculosDescompuestos').textContent = descompuestos;

}

const btnCancelarEstado = document.getElementById(
    'btnCancelarEstado'
);

const btnGuardarEstado = document.getElementById(
    'btnGuardarEstado'
);

btnCancelarEstado.addEventListener('click', () => {

    const modal = document.getElementById('modalEstado');

    modal.setAttribute('data-id', '');
    modal.classList.add('oculto');

});

btnGuardarEstado.addEventListener('click', async () => {

    const modal = document.getElementById('modalEstado');

    const id = modal.getAttribute('data-id');

    const nuevoEstado = document.getElementById(
        'selectEstado'
    ).value;

    console.log('ID al guardar:', id);
    console.log('Nuevo estado:', nuevoEstado);

    if (!id) {

        alert('No hay vehículo seleccionado');

        return;
    }

    try {

        await fetch(`http://localhost:3000/api/vehiculos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                estado: nuevoEstado
            })
        });

        modal.setAttribute('data-id', '');
        modal.classList.add('oculto');

        obtenerVehiculos();

    } catch (error) {

        console.error(
            'Error al actualizar estado:',
            error
        );

    }

});