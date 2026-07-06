const pool = require('../config/db');

/**
 * Regla de negocio: un vehículo 'Descompuesto' no cambia de estado
 * automáticamente; requiere intervención manual.
 * Devuelve el estado actual o null si el vehículo no existe.
 */
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

/**
 * Sincroniza el estado del vehículo según el resultado de una inspección.
 * 'Requiere mantenimiento' -> 'En mantenimiento'
 * 'Aprobado'               -> 'Activo'
 */
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

/**
 * Sincroniza el estado del vehículo según el estado de un mantenimiento.
 * 'Pendiente' / 'En proceso' -> 'En mantenimiento'
 * 'Finalizado'               -> 'Activo'
 */
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
