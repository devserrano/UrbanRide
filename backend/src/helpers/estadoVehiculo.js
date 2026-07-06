const pool = require('../config/db');


async function obtenerEstadoSiModificable(vehiculo_id) {
    const vehiculoActual = await pool.query(
        'SELECT estado FROM vehiculos WHERE id = $1',
        [vehiculo_id]
    );

    if (vehiculoActual.rows.length === 0) {
        return null;
    }

    const estado = vehiculoActual.rows[0].estado;

    return estado === 'Descompuesto' ? null : estado;
}


async function actualizarEstadoVehiculoPorInspeccion(vehiculo_id, resultado) {
    const estadoActual = await obtenerEstadoSiModificable(vehiculo_id);

    if (estadoActual === null) {
        return;
    }

    if (resultado === 'Requiere mantenimiento') {
        await pool.query(
            `UPDATE vehiculos SET estado = 'En mantenimiento' WHERE id = $1`,
            [vehiculo_id]
        );
    } else if (resultado === 'Aprobado') {
        await pool.query(
            `UPDATE vehiculos SET estado = 'Activo' WHERE id = $1`,
            [vehiculo_id]
        );
    }
}

async function actualizarEstadoVehiculoPorMantenimiento(vehiculo_id, estado) {
    const estadoActual = await obtenerEstadoSiModificable(vehiculo_id);

    if (estadoActual === null) {
        return;
    }

    if (estado === 'Pendiente' || estado === 'En proceso') {
        await pool.query(
            `UPDATE vehiculos SET estado = 'En mantenimiento' WHERE id = $1`,
            [vehiculo_id]
        );
    } else if (estado === 'Finalizado') {
        await pool.query(
            `UPDATE vehiculos SET estado = 'Activo' WHERE id = $1`,
            [vehiculo_id]
        );
    }
}

module.exports = {
    actualizarEstadoVehiculoPorInspeccion,
    actualizarEstadoVehiculoPorMantenimiento
};
