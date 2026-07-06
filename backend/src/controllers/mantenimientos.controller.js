const pool = require('../config/db');
const {
    actualizarEstadoVehiculoPorMantenimiento
} = require('../helpers/estadoVehiculo');

// GET 
async function obtenerMantenimientos(req, res) {
    try {
        const resultado = await pool.query(
            `
            SELECT
                mantenimientos.id,
                mantenimientos.vehiculo_id,
                vehiculos.unidad,
                mantenimientos.fecha,
                mantenimientos.servicio,
                mantenimientos.costo,
                mantenimientos.estado,
                mantenimientos.observaciones
            FROM mantenimientos
            JOIN vehiculos
                ON mantenimientos.vehiculo_id = vehiculos.id
            ORDER BY mantenimientos.id DESC
            `
        );

        res.json(resultado.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener mantenimientos' });
    }
}

// POST 
async function crearMantenimiento(req, res) {
    try {
        const { vehiculo_id, servicio, costo, estado, observaciones } = req.body;

        const resultado = await pool.query(
            `
            INSERT INTO mantenimientos
                (vehiculo_id, servicio, costo, estado, observaciones)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [vehiculo_id, servicio, costo, estado, observaciones]
        );

        await actualizarEstadoVehiculoPorMantenimiento(vehiculo_id, estado);

        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al guardar mantenimiento' });
    }
}

// PUT 
async function actualizarMantenimiento(req, res) {
    try {
        const { id } = req.params;
        const { vehiculo_id, servicio, costo, estado, observaciones } = req.body;

        const resultado = await pool.query(
            `
            UPDATE mantenimientos
            SET vehiculo_id = $1,
                servicio = $2,
                costo = $3,
                estado = $4,
                observaciones = $5
            WHERE id = $6
            RETURNING *
            `,
            [vehiculo_id, servicio, costo, estado, observaciones, id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
        }

        await actualizarEstadoVehiculoPorMantenimiento(vehiculo_id, estado);

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al actualizar mantenimiento' });
    }
}

// PUT 
async function finalizarMantenimiento(req, res) {
    try {
        const { id } = req.params;

        const mantenimiento = await pool.query(
            'SELECT * FROM mantenimientos WHERE id = $1',
            [id]
        );

        if (mantenimiento.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Mantenimiento no encontrado' });
        }

        const vehiculo_id = mantenimiento.rows[0].vehiculo_id;

        const resultado = await pool.query(
            `
            UPDATE mantenimientos
            SET estado = 'Finalizado'
            WHERE id = $1
            RETURNING *
            `,
            [id]
        );

        await actualizarEstadoVehiculoPorMantenimiento(vehiculo_id, 'Finalizado');

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al finalizar mantenimiento' });
    }
}

module.exports = {
    obtenerMantenimientos,
    crearMantenimiento,
    actualizarMantenimiento,
    finalizarMantenimiento
};
